import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import { getScoreBounds } from "@/lib/tests/scoring";
import { getTestTheme, type TestTheme } from "@/lib/tests/theme";
import { ANONYMOUS_NICKNAME } from "./nickname";
import { getInvitation } from "./share-copy";
import type { SharedResult } from "./result-link";

const colors = {
  ink: "#17120f",
  paper: "#fff8e7",
  tomato: "#c8321d",
  mustard: "#f3b61f",
  mint: "#2bbf8a"
};

// Archivo Black (Google Fonts, licencia OFL en fonts/ArchivoBlack-OFL.txt).
let fontData: Promise<Buffer> | null = null;

function loadFont() {
  fontData ??= readFile(join(process.cwd(), "src/lib/share/fonts/ArchivoBlack-Regular.ttf"));
  return fontData;
}

async function imageOptions(width: number, height: number) {
  return {
    width,
    height,
    fonts: [{ name: "Archivo Black", data: await loadFont(), weight: 400 as const, style: "normal" as const }],
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      "X-Robots-Tag": "noindex"
    }
  };
}

function bySize(text: string, sizes: [number, number][], fallback: number) {
  return sizes.find(([maxLength]) => text.length <= maxLength)?.[1] ?? fallback;
}

function gaugeValue(shared: SharedResult) {
  const { min, max } = getScoreBounds(shared.test);
  return (shared.score - min) / Math.max(1, max - min);
}

// Sin nombre (o con un nombre que el filtro rechazó) no se muestra "Anónimo".
function hasName(nickname: string) {
  return nickname !== ANONYMOUS_NICKNAME;
}

// Imagen de vista previa 1200×630 (WhatsApp, X, Instagram DM), con el color
// del test en la franja. Colores planos para que el PNG pese poco.
export async function renderResultPreview(shared: SharedResult) {
  const { test, score, nickname, result } = shared;
  const invitation = getInvitation(test.slug, test.title);
  const theme = getTestTheme(test.slug);
  const { max } = getScoreBounds(test);
  const named = hasName(nickname);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.paper,
          border: `14px solid ${colors.ink}`,
          color: colors.ink,
          fontFamily: "Archivo Black"
        }}
      >
        <TopBand theme={theme} />

        <div style={{ display: "flex", flex: 1, alignItems: "center", padding: "0 36px" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 28 }}>
            {named ? (
              <div
                style={{
                  fontSize: bySize(nickname, [[10, 74], [14, 62]], 52),
                  lineHeight: 1,
                  textTransform: "uppercase"
                }}
              >
                {nickname}
              </div>
            ) : null}
            <div style={{ fontSize: 30, marginTop: named ? 12 : 0 }}>
              {named ? `cayó en el ${test.title}` : `Resultado del ${test.title}`}
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: bySize(result.title, [[20, 60], [30, 50]], 44),
                lineHeight: 1.04,
                color: theme.text,
                textTransform: "uppercase"
              }}
            >
              {result.title}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 320 }}>
            <Gauge size={300} value={gaugeValue(shared)} />
            <div style={{ display: "flex", alignItems: "flex-end", marginTop: 6 }}>
              <span style={{ fontSize: 96, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 36, marginBottom: 10 }}>{`/${max}`}</span>
            </div>
          </div>
        </div>

        <BottomBar left={invitation.question} />
      </div>
    ),
    await imageOptions(1200, 630)
  );
}

// Imagen vertical 1080×1920 para historias de Instagram, con fondo del color
// del test. Instagram tapa unos 250 px arriba y 340 abajo con su interfaz:
// la tarjeta va entre esas dos zonas, lo más grande posible. Sus textos van
// en negro sobre crema, para que se lean sobre cualquier color de test.
export async function renderResultStory(shared: SharedResult) {
  const { test, score, nickname, result } = shared;
  const invitation = getInvitation(test.slug, test.title);
  const theme = getTestTheme(test.slug);
  const { max } = getScoreBounds(test);
  const named = hasName(nickname);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "250px 50px 0",
          backgroundColor: theme.bg,
          color: colors.ink,
          fontFamily: "Archivo Black"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: theme.on }}>
          <span style={{ fontSize: 54, lineHeight: 1 }}>TESTÓMETRO CHILENO</span>
          {/* Cuenta de Instagram: firma bajo la marca, lejos del resultado y
              dentro de la zona que Instagram no tapa. */}
          <span style={{ fontSize: 34, lineHeight: 1, marginTop: 12 }}>@eltestometro</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 962,
            height: 1150,
            marginTop: 20,
            backgroundColor: colors.paper,
            border: `12px solid ${colors.ink}`,
            borderRadius: 34,
            boxShadow: `18px 18px 0 ${colors.ink}`,
            overflow: "hidden"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: colors.ink,
              color: colors.paper,
              padding: "22px 0",
              fontSize: 42
            }}
          >
            ÚLTIMO MINUTO
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              padding: "0 50px",
              color: colors.ink
            }}
          >
            <Gauge size={560} ticks value={gaugeValue(shared)} />
            {named ? (
              <div
                style={{
                  marginTop: 18,
                  fontSize: bySize(nickname, [[8, 100], [12, 82], [16, 66]], 56),
                  lineHeight: 1,
                  textTransform: "uppercase",
                  textAlign: "center"
                }}
              >
                {nickname}
              </div>
            ) : null}
            <div style={{ fontSize: 42, marginTop: named ? 16 : 24, textAlign: "center" }}>
              {named ? `cayó en el ${test.title}` : `Resultado del ${test.title}`}
            </div>
            <div
              style={{
                marginTop: 30,
                fontSize: bySize(result.title, [[16, 82], [24, 68], [32, 58]], 50),
                lineHeight: 1.04,
                color: theme.text,
                textTransform: "uppercase",
                textAlign: "center"
              }}
            >
              {result.title}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", marginTop: 26 }}>
              <span style={{ fontSize: 120, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 52, marginBottom: 14 }}>{`/${max}`}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: colors.mustard,
              borderTop: `10px solid ${colors.ink}`,
              padding: "28px 20px",
              color: colors.ink
            }}
          >
            <span style={{ fontSize: 50, textAlign: "center" }}>{invitation.question}</span>
            <span style={{ fontSize: 46, marginTop: 8 }}>testometro.cl</span>
          </div>
        </div>
      </div>
    ),
    await imageOptions(1080, 1920)
  );
}

// La aguja del "-ómetro" (misma de components/brand/Gauge.tsx), con la punta
// calculada a mano porque las imágenes no giran elementos.
function Gauge({ size, value, ticks = false }: { size: number; value: number; ticks?: boolean }) {
  const angle = Math.PI * (1 - Math.max(0, Math.min(1, value)));
  const tip = { x: 110 + 76 * Math.cos(angle), y: 112 - 76 * Math.sin(angle) };
  return (
    <svg width={size} height={Math.round(size * 0.6)} viewBox="0 0 220 132">
      <path d="M20 112 A90 90 0 0 1 200 112" fill="none" stroke={colors.ink} strokeWidth="30" />
      <path d="M20 112 A90 90 0 0 1 65 34" fill="none" stroke={colors.mint} strokeWidth="22" />
      <path d="M65 34 A90 90 0 0 1 155 34" fill="none" stroke={colors.mustard} strokeWidth="22" />
      <path d="M155 34 A90 90 0 0 1 200 112" fill="none" stroke={colors.tomato} strokeWidth="22" />
      {ticks
        ? Array.from({ length: 11 }, (_, index) => {
            const tickAngle = Math.PI * (1 - index / 10);
            const inner = index % 5 === 0 ? 50 : 56;
            return (
              <line
                key={index}
                stroke={colors.ink}
                strokeLinecap="round"
                strokeWidth={index % 5 === 0 ? 4 : 2.5}
                x1={110 + inner * Math.cos(tickAngle)}
                x2={110 + 64 * Math.cos(tickAngle)}
                y1={112 - inner * Math.sin(tickAngle)}
                y2={112 - 64 * Math.sin(tickAngle)}
              />
            );
          })
        : null}
      <line x1="110" y1="112" x2={tip.x} y2={tip.y} stroke={colors.ink} strokeWidth="9" strokeLinecap="round" />
      <circle cx="110" cy="112" r="13" fill={colors.ink} />
    </svg>
  );
}

function TopBand({ theme }: { theme: TestTheme }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.bg,
        borderBottom: `8px solid ${colors.ink}`,
        padding: "14px 36px",
        color: theme.on,
        fontSize: 28
      }}
    >
      <span>ÚLTIMO MINUTO</span>
      <span>TESTÓMETRO CHILENO</span>
    </div>
  );
}

function BottomBar({ left }: { left: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0 36px 30px",
        padding: "16px 26px",
        backgroundColor: colors.mustard,
        border: `6px solid ${colors.ink}`,
        fontSize: 30
      }}
    >
      <span>{left}</span>
      <span>testometro.cl</span>
    </div>
  );
}

function PreviewFrame({ children, footer, theme }: { children: ReactNode; footer: string; theme: TestTheme }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.paper,
        border: `14px solid ${colors.ink}`,
        color: colors.ink,
        fontFamily: "Archivo Black"
      }}
    >
      <TopBand theme={theme} />
      <div style={{ display: "flex", flex: 1, alignItems: "center", padding: "0 36px" }}>{children}</div>
      <BottomBar left={footer} />
    </div>
  );
}

// Vista previa de la portada de un test (/tests/<slug>): la pregunta del test
// en grande. Reemplaza al meme genérico, que pesaba 885 KB.
export async function renderTestPreview(input: {
  slug: string;
  headline: string;
  title: string;
  questionCount: number;
  durationLabel: string;
}) {
  const theme = getTestTheme(input.slug);
  return new ImageResponse(
    (
      <PreviewFrame footer="Sí o no · gratis · sin registro" theme={theme}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 24 }}>
          <div
            style={{
              fontSize: bySize(input.headline, [[18, 92], [24, 80]], 68),
              lineHeight: 1,
              textTransform: "uppercase"
            }}
          >
            {input.headline}
          </div>
          <div style={{ fontSize: 30, marginTop: 22, color: theme.text }}>
            {`${input.title} · ${input.questionCount} preguntas · ${input.durationLabel}`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 300 }}>
          <Gauge size={290} ticks value={0.8} />
        </div>
      </PreviewFrame>
    ),
    await imageOptions(1200, 630)
  );
}

// Vista previa general del sitio (home y páginas sin imagen propia).
export async function renderSitePreview(input: { tagline: string; testCount: number }) {
  return new ImageResponse(
    (
      <PreviewFrame footer={`${input.testCount} tests · sí o no · gratis`} theme={getTestTheme("chantometro")}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 24 }}>
          <div style={{ fontSize: 96, lineHeight: 0.95, textTransform: "uppercase" }}>Testómetro</div>
          <div style={{ fontSize: 96, lineHeight: 0.95, textTransform: "uppercase", color: colors.tomato }}>
            Chileno
          </div>
          <div style={{ fontSize: 40, marginTop: 24 }}>{input.tagline}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 300 }}>
          <Gauge size={290} ticks value={0.75} />
        </div>
      </PreviewFrame>
    ),
    await imageOptions(1200, 630)
  );
}
