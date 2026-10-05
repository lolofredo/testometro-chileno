// Prueba interceptada de Google Analytics y del aviso de cookies.
// Abre Chrome sin ventana con un perfil nuevo y recorre el sitio tres veces:
// sin elegir, rechazando y aceptando. Toda llamada a Google y a Supabase se
// responde aquí mismo: no se envía nada a Google ni se escribe nada en la
// base de datos. (Lo único que sale a internet hacia Google es la descarga
// del script público gtag.js, igual que haría cualquier visita.)
//
// Repetirla cada vez que cambie algo de Google Analytics (código o ajustes
// del flujo) o de los links para compartir:
//   node scripts/ga-check.mjs                     (contra https://testometro.cl)
//   node scripts/ga-check.mjs http://localhost:3000
// En local, Google Analytics solo se carga si se compiló con
// NEXT_PUBLIC_GA_TEST_HOSTS=localhost.
//
// Resultado esperado: sin elegir y al rechazar, cero llamadas a Google y
// ninguna cookie _ga; al aceptar, solo page_view y los 4 eventos
// (test_started, test_completed, share_click, next_test_click), sin
// páginas duplicadas y sin el apodo, el código de /r/, el link de WhatsApp
// ni el código de la sesión. Termina con código 1 si algo falla.
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = (process.argv[2] ?? "https://testometro.cl").replace(/\/$/, "");
const chromePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const nickname = "Zorzalito";
const allowedEvents = new Set(["page_view", "test_started", "test_completed", "share_click", "next_test_click"]);
const port = 9334;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// El ID de medición se lee del código, para descargar su gtag.js.
const googleSource = readFileSync(new URL("../src/lib/analytics/google.ts", import.meta.url), "utf8");
const measurementId = googleSource.match(/GA_MEASUREMENT_ID = "(G-[A-Z0-9]+)"/)?.[1];
if (!measurementId) throw new Error("No hay ID de medición en src/lib/analytics/google.ts");
const gtagResponse = await fetch(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
const gtagBody = Buffer.from(await gtagResponse.arrayBuffer()).toString("base64");

async function runVisit(label, choice) {
  const profile = mkdtempSync(join(tmpdir(), "ga-check-"));
  const chrome = spawn(
    chromePath,
    ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "about:blank"],
    { stdio: "ignore" }
  );

  let wsUrl;
  for (let attempt = 0; attempt < 50 && !wsUrl; attempt += 1) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      wsUrl = targets.find((target) => target.type === "page")?.webSocketDebuggerUrl;
    } catch {
      // Chrome todavía no responde.
    }
    if (!wsUrl) await sleep(200);
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve));
  let lastId = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener("message", (message) => {
    const data = JSON.parse(message.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    } else {
      listeners.forEach((listener) => listener(data));
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      lastId += 1;
      pending.set(lastId, resolve);
      ws.send(JSON.stringify({ id: lastId, method, params }));
    });
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    return response.result?.result?.value;
  };

  const googleCalls = [];
  listeners.push((message) => {
    if (message.method !== "Fetch.requestPaused") return;
    const { requestId, request } = message.params;
    const url = request.url;
    if (/supabase\.co/.test(url)) {
      // Supabase: nada se escribe; lecturas vacías.
      const body = url.includes("/rpc/score_percentile") ? "null" : request.method === "GET" ? "[]" : "";
      send("Fetch.fulfillRequest", {
        requestId,
        responseCode: request.method === "GET" || body ? 200 : 201,
        responseHeaders: [
          { name: "Content-Type", value: "application/json" },
          { name: "Access-Control-Allow-Origin", value: "*" }
        ],
        body: Buffer.from(body).toString("base64")
      });
      return;
    }
    googleCalls.push({ url, post: request.postData ?? "" });
    if (url.includes("/gtag/js")) {
      send("Fetch.fulfillRequest", {
        requestId,
        responseCode: 200,
        responseHeaders: [{ name: "Content-Type", value: "application/javascript" }],
        body: gtagBody
      });
    } else {
      send("Fetch.fulfillRequest", { requestId, responseCode: 204, responseHeaders: [] });
    }
  });

  await send("Fetch.enable", {
    patterns: [
      { urlPattern: "*google*" },
      { urlPattern: "*doubleclick*" },
      { urlPattern: "*googletagmanager*" },
      { urlPattern: "*supabase.co*" }
    ]
  });
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 667, deviceScaleFactor: 2, mobile: true });

  const loaded = () =>
    new Promise((resolve) => {
      const listener = (message) => {
        if (message.method === "Page.loadEventFired") {
          listeners.splice(listeners.indexOf(listener), 1);
          resolve();
        }
      };
      listeners.push(listener);
    });
  const open = async (path) => {
    const done = loaded();
    await send("Page.navigate", { url: `${base}${path}` });
    await done;
    await sleep(2000);
  };

  // Recorrido: home, elección, catálogo, un test completo con apodo,
  // resultado (bajar, WhatsApp, Copiar, Siguiente test), resultado
  // compartido y privacidad.
  await open("/");
  if (choice) {
    await evaluate(`(async () => {
      [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === ${JSON.stringify(choice)}).click();
      await new Promise((r) => setTimeout(r, 1500));
    })()`);
  }
  await evaluate(`(async () => {
    document.querySelector('a[href="/tests"]').click();
    await new Promise((r) => setTimeout(r, 2000));
  })()`);
  await open("/tests/farandulometro/start");
  const finished = await evaluate(`(async () => {
    const s = (ms) => new Promise((r) => setTimeout(r, ms));
    const format = localStorage.getItem("testometro:formato");
    if (format === "una") {
      for (let i = 0; i < 60; i += 1) {
        const button = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === (i % 3 ? "No" : "Sí"));
        if (!button) break;
        button.click();
        await s(260);
      }
    } else {
      for (let block = 0; block < 6; block += 1) {
        const next = document.getElementById("siguiente-bloque");
        if (!next) break;
        for (const row of document.querySelectorAll("[id^=pregunta-]")) {
          row.querySelectorAll("button")[0].click();
          await s(40);
        }
        next.click();
        await s(800);
      }
    }
    await s(500);
    const input = document.getElementById("nickname");
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, ${JSON.stringify(nickname)});
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await s(200);
    document.querySelector("form button[type=submit]").click();
    await s(3000);
    return location.pathname.startsWith("/results/");
  })()`);
  const sharedPath = await evaluate(`(async () => {
    const s = (ms) => new Promise((r) => setTimeout(r, ms));
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    await s(1500);
    const whatsapp = [...document.querySelectorAll("a")].find((a) => a.textContent.includes("Mandarlo"));
    whatsapp.addEventListener("click", (event) => event.preventDefault(), { once: true });
    whatsapp.click();
    await s(1000);
    [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Copiar").click();
    await s(800);
    const shared = [...document.querySelectorAll("a")].find((a) => a.textContent.includes("Ver cómo se ve")).getAttribute("href");
    [...document.querySelectorAll("a")].find((a) => a.textContent.includes("Siguiente test")).click();
    await s(2500);
    return shared;
  })()`);
  await open(sharedPath);
  await open("/privacidad");
  await sleep(4000);

  const cookies = ((await send("Network.getAllCookies")).result?.cookies ?? []).map((cookie) => cookie.name);
  ws.close();
  chrome.kill();
  return { label, finished, sharedPath, googleCalls, gaCookies: cookies.filter((name) => name.startsWith("_ga")) };
}

function readHits(calls) {
  const hits = [];
  for (const call of calls) {
    const url = new URL(call.url);
    if (!url.pathname.endsWith("/collect")) continue;
    for (const line of [url.search.slice(1), ...call.post.split("\n")]) {
      const params = new URLSearchParams(line);
      const name = params.get("en");
      if (!name) continue;
      hits.push({ name, location: params.get("dl") ?? url.searchParams.get("dl") ?? "", params });
    }
  }
  return hits;
}

const problems = [];
const visits = [];
for (const [label, choice] of [
  ["sin elegir", null],
  ["rechazando", "Rechazar"],
  ["aceptando", "Aceptar"]
]) {
  visits.push(await runVisit(label, choice));
}

for (const visit of visits) {
  console.log(`\n== ${visit.label}: test terminado ${visit.finished ? "sí" : "NO"}`);
  if (!visit.finished) problems.push(`${visit.label}: no se pudo terminar el test`);
  if (visit.label !== "aceptando") {
    console.log(`   llamadas a Google: ${visit.googleCalls.length}, cookies _ga: ${visit.gaCookies.length}`);
    if (visit.googleCalls.length || visit.gaCookies.length) problems.push(`${visit.label}: hubo llamadas o cookies de Google`);
    continue;
  }

  const hits = readHits(visit.googleCalls);
  const everything = visit.googleCalls.map((call) => decodeURIComponent(call.url) + decodeURIComponent(call.post)).join("\n");
  const token = visit.sharedPath.split("/").pop();
  for (const hit of hits) {
    const extra = [...hit.params]
      .filter(([key]) => key.startsWith("ep."))
      .map(([key, value]) => `${key.slice(3)}=${value}`)
      .join(", ");
    console.log(`   ${hit.name.padEnd(16)} ${hit.location.replace(base, "")} ${extra}`);
    if (!allowedEvents.has(hit.name)) problems.push(`evento no esperado: ${hit.name}`);
  }
  const pageViews = hits.filter((hit) => hit.name === "page_view").map((hit) => hit.location);
  pageViews.forEach((location, index) => {
    if (index > 0 && location === pageViews[index - 1]) problems.push(`página duplicada: ${location}`);
  });
  for (const name of ["test_started", "test_completed", "share_click", "next_test_click"]) {
    if (!hits.some((hit) => hit.name === name)) problems.push(`falta el evento ${name}`);
  }
  for (const [what, needle] of [
    ["el apodo", nickname],
    ["el código de /r/", token],
    ["el link de WhatsApp", "wa.me"],
    ["el código de la sesión", "session="],
    ["la dirección de /results con código", "/results/"]
  ]) {
    if (everything.includes(needle)) problems.push(`se envió ${what}`);
  }
  console.log(`   cookies _ga: ${visit.gaCookies.join(", ") || "ninguna"}`);
}

console.log(problems.length ? `\nFALLÓ:\n- ${problems.join("\n- ")}` : "\nOK: solo nuestras páginas y los 4 eventos.");
process.exit(problems.length ? 1 : 0);
