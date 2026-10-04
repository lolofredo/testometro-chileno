import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getInvitation } from "./share-copy";
import type { SharedResult } from "./result-link";

const colors = {
  ink: "#17120f",
  paper: "#fff8e7",
  tomato: "#d93a24",
  mustard: "#f3b61f",
  bluepop: "#1c5bd6"
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

// Imagen de vista previa 1200×630 (WhatsApp, X, Instagram DM). Colores
// planos para que el PNG pese poco.
export async function renderResultPreview(shared: SharedResult) {
  const { test, score, nickname, result } = shared;
  const invitation = getInvitation(test.slug, test.title);

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.tomato,
            borderBottom: `8px solid ${colors.ink}`,
            padding: "14px 36px",
            color: colors.paper,
            fontSize: 28
          }}
        >
          <span>ÚLTIMO MINUTO</span>
          <span>TESTÓMETRO CHILENO</span>
        </div>

        <div style={{ display: "flex", flex: 1, padding: "30px 36px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 32 }}>
            <div
              style={{
                fontSize: bySize(nickname, [[10, 78], [14, 64]], 54),
                lineHeight: 1,
                textTransform: "uppercase"
              }}
            >
              {nickname}
            </div>
            <div style={{ fontSize: 30, marginTop: 12 }}>{`cayó en el ${test.title}`}</div>
            <div
              style={{
                marginTop: 22,
                fontSize: bySize(result.title, [[20, 62], [30, 50]], 44),
                lineHeight: 1.05,
                color: colors.bluepop,
                textTransform: "uppercase"
              }}
            >
              {result.title}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-start",
              width: 280,
              padding: "18px 10px",
              backgroundColor: "#ffffff",
              border: `8px solid ${colors.ink}`,
              boxShadow: `12px 12px 0 ${colors.ink}`
            }}
          >
            <span style={{ fontSize: 24 }}>PUNTAJE</span>
            <span style={{ fontSize: 130, lineHeight: 1.1 }}>{score}</span>
            <span style={{ fontSize: result.shortLabel.length > 12 ? 18 : 24, textAlign: "center" }}>
              {result.shortLabel.toUpperCase()}
            </span>
          </div>
        </div>

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
          <span>{invitation.question}</span>
          <span>testometro.cl</span>
        </div>
      </div>
    ),
    await imageOptions(1200, 630)
  );
}

// Imagen vertical 1080×1920 para historias de Instagram. Lo importante va en
// el centro: Instagram tapa unos 250 px arriba y abajo con su interfaz.
export async function renderResultStory(shared: SharedResult) {
  const { test, score, nickname, result } = shared;
  const invitation = getInvitation(test.slug, test.title);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 70px",
          backgroundColor: colors.tomato,
          color: colors.ink,
          fontFamily: "Archivo Black"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 48,
            color: colors.paper,
            fontSize: 58
          }}
        >
          TESTÓMETRO CHILENO
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: colors.paper,
            border: `12px solid ${colors.ink}`,
            boxShadow: `22px 22px 0 ${colors.ink}`
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: colors.ink,
              color: colors.paper,
              padding: "20px 0",
              fontSize: 40
            }}
          >
            ÚLTIMO MINUTO
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 50px 56px" }}>
            <div
              style={{
                fontSize: bySize(nickname, [[8, 104], [12, 84], [16, 68]], 58),
                lineHeight: 1,
                textTransform: "uppercase",
                textAlign: "center"
              }}
            >
              {nickname}
            </div>
            <div style={{ fontSize: 40, marginTop: 18, textAlign: "center" }}>
              {`cayó en el ${test.title}`}
            </div>

            <div
              style={{
                marginTop: 44,
                fontSize: bySize(result.title, [[16, 84], [24, 70], [32, 60]], 52),
                lineHeight: 1.05,
                color: colors.bluepop,
                textTransform: "uppercase",
                textAlign: "center"
              }}
            >
              {result.title}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 50,
                width: 420,
                padding: "22px 10px",
                backgroundColor: "#ffffff",
                border: `10px solid ${colors.ink}`,
                boxShadow: `14px 14px 0 ${colors.ink}`
              }}
            >
              <span style={{ fontSize: 34 }}>PUNTAJE</span>
              <span style={{ fontSize: 200, lineHeight: 1.1 }}>{score}</span>
              <span style={{ fontSize: result.shortLabel.length > 12 ? 26 : 34, textAlign: "center" }}>
                {result.shortLabel.toUpperCase()}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: colors.mustard,
              borderTop: `10px solid ${colors.ink}`,
              padding: "30px 20px"
            }}
          >
            <span style={{ fontSize: 50, textAlign: "center" }}>{invitation.question}</span>
            <span style={{ fontSize: 46, marginTop: 10, color: colors.tomato }}>testometro.cl</span>
          </div>
        </div>
      </div>
    ),
    await imageOptions(1080, 1920)
  );
}
