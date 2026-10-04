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

// La fuente incluida en next/og trae un solo grosor; el trazo la engruesa
// para que se parezca a los titulares del sitio.
function bold(width: number, color: string = colors.ink) {
  return { WebkitTextStroke: `${width}px ${color}` };
}

function titleSize(title: string) {
  if (title.length > 30) return 50;
  if (title.length > 20) return 58;
  return 70;
}

function nicknameSize(nickname: string) {
  if (nickname.length > 14) return 64;
  return 84;
}

// Imagen de vista previa 1200×630 (WhatsApp, X, Instagram DM). Colores
// planos para que el PNG pese poco.
export function renderResultPreview(shared: SharedResult) {
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
          color: colors.ink
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
            fontSize: 30,
            letterSpacing: 2,
            ...bold(1, colors.paper)
          }}
        >
          <span>ÚLTIMO MINUTO</span>
          <span>TESTÓMETRO CHILENO</span>
        </div>

        <div style={{ display: "flex", flex: 1, padding: "30px 36px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 32 }}>
            <div
              style={{
                fontSize: nicknameSize(nickname),
                lineHeight: 1,
                textTransform: "uppercase",
                ...bold(3)
              }}
            >
              {nickname}
            </div>
            <div style={{ fontSize: 34, marginTop: 10, ...bold(1) }}>
              {`cayó en el ${test.title}`}
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: titleSize(result.title),
                lineHeight: 1.05,
                color: colors.bluepop,
                textTransform: "uppercase",
                ...bold(2.5, colors.bluepop)
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
            <span style={{ fontSize: 26, letterSpacing: 2, ...bold(0.8) }}>PUNTAJE</span>
            <span style={{ fontSize: 150, lineHeight: 1, ...bold(5) }}>{score}</span>
            <span
              style={{
                fontSize: result.shortLabel.length > 12 ? 22 : 26,
                textAlign: "center",
                ...bold(0.8)
              }}
            >
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
            fontSize: 34,
            ...bold(1.2)
          }}
        >
          <span>{invitation.question}</span>
          <span>testometro.cl</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
        "X-Robots-Tag": "noindex"
      }
    }
  );
}
