"use client";

import { useEffect, useState } from "react";
import { Copy, Instagram, Share2 } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { getSharePath } from "@/lib/share/result-link";
import { getShareText } from "@/lib/share/share-copy";
import { trackEvent, type ShareChannel } from "@/lib/analytics/events";

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.8 3.4.7.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.2 2.3h3.4l-7.4 8.5 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9L.9 2.3h7l4.8 6.4 5.5-6.4Zm-1.2 18h1.9L7 4.2H5l12 16.1Z" />
    </svg>
  );
}

function getWhatsAppHref(text: string, url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
}

// Marca de origen en el link compartido, para saber cuánta gente nueva trae
// cada canal (la lee lib/analytics/origin.ts en quien abre el link).
type ShareSource = "whatsapp" | "x" | "instagram" | "compartido";

function withShareOrigin(url: string, source: ShareSource) {
  return `${url}?utm_source=${source}&utm_campaign=resultado`;
}

type ShareInput = {
  testSlug: string;
  testTitle: string;
  resultTitle: string;
  sharePhrase: string;
  score: number;
  nickname: string;
  sessionId: string;
};

function trackShare(input: ShareInput, channel: ShareChannel) {
  trackEvent("share_click", { testSlug: input.testSlug, sessionId: input.sessionId, channel });
}

const shareSectionId = "compartir";

function getShareData({
  testSlug,
  testTitle,
  resultTitle,
  sharePhrase,
  score,
  nickname
}: ShareInput) {
  const shareUrl = absoluteUrl(getSharePath(testSlug, score, nickname));
  const shareText = getShareText({ testSlug, testTitle, resultTitle, sharePhrase, score });
  return {
    shareUrl,
    shareText,
    whatsappHref: getWhatsAppHref(shareText, withShareOrigin(shareUrl, "whatsapp"))
  };
}

// Barra fija abajo en celular, para que WhatsApp quede a mano sin bajar.
// Se oculta apenas aparece la sección de compartir, para no mostrar dos
// botones de WhatsApp juntos.
export function StickyWhatsAppBar(props: ShareInput) {
  const { whatsappHref } = getShareData(props);
  const [shareSectionReached, setShareSectionReached] = useState(false);

  useEffect(() => {
    const section = document.getElementById(shareSectionId);
    if (!section || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      setShareSectionReached(entry.boundingClientRect.top < window.innerHeight);
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (shareSectionReached) return null;

  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t-4 border-ink bg-paper p-3 sm:hidden">
      <a
        className="focus-ring flex w-full items-center justify-center gap-2 border-4 border-ink bg-[#25d366] px-4 py-3 text-sm font-black uppercase text-ink"
        href={whatsappHref}
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => trackShare(props, "whatsapp")}
      >
        <WhatsAppIcon />
        Compartir por WhatsApp
      </a>
    </div>
  );
}

export function ShareButtons(props: ShareInput) {
  const { testTitle } = props;
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [storyHint, setStoryHint] = useState(false);

  const { shareUrl, shareText, whatsappHref } = getShareData(props);
  const sharePath = new URL(shareUrl).pathname;
  const storyPath = `${sharePath}/historia`;

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  // En celular la imagen se comparte como archivo (Instagram la recibe directo
  // en historias). Se descarga antes porque el navegador exige compartir
  // apenas se toca el botón.
  useEffect(() => {
    if (typeof navigator.canShare !== "function") return;
    let cancelled = false;

    fetch(storyPath)
      .then((response) => (response.ok ? response.blob() : Promise.reject()))
      .then((blob) => {
        const file = new File([blob], "testometro-historia.png", { type: "image/png" });
        if (!cancelled && navigator.canShare({ files: [file] })) setStoryFile(file);
      })
      .catch(() => {
        // Sin archivo, el botón queda como descarga normal.
      });

    return () => {
      cancelled = true;
    };
  }, [storyPath]);

  async function shareStory() {
    if (!storyFile) return;
    trackShare(props, "story");
    // El link queda copiado para pegarlo con el sticker de enlace de Instagram.
    navigator.clipboard?.writeText(withShareOrigin(shareUrl, "instagram")).catch(() => {});
    setStoryHint(true);
    try {
      await navigator.share({ files: [storyFile] });
    } catch {
      // La persona cerró el menú de compartir.
    }
  }

  async function nativeShare() {
    trackShare(props, "native");
    try {
      await navigator.share({
        title: testTitle,
        text: shareText,
        url: withShareOrigin(shareUrl, "compartido")
      });
    } catch {
      // La persona cerró el menú de compartir.
    }
  }

  async function copyLink() {
    trackShare(props, "copy");
    await navigator.clipboard.writeText(`${shareText} ${withShareOrigin(shareUrl, "compartido")}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const secondaryButton =
    "focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-white px-4 py-3 text-sm font-black uppercase";

  return (
    <section
      className="mt-6 border-4 border-ink bg-paper p-4 shadow-[8px_8px_0_#17120f] sm:p-6"
      id={shareSectionId}
    >
      <p className="mb-3 text-center text-lg font-black uppercase sm:text-xl">
        Compártelo y desafía a tus amigos
      </p>

      <a
        className="focus-ring flex w-full items-center justify-center gap-2 border-4 border-ink bg-[#25d366] px-5 py-4 text-base font-black uppercase text-ink shadow-[5px_5px_0_#17120f] transition hover:-translate-y-0.5"
        href={whatsappHref}
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => trackShare(props, "whatsapp")}
      >
        <WhatsAppIcon />
        Compartir por WhatsApp
      </a>

      <div className={`mt-3 grid gap-3 ${canNativeShare ? "grid-cols-3" : "grid-cols-2"}`}>
        {canNativeShare ? (
          <button className={secondaryButton} type="button" onClick={nativeShare}>
            <Share2 size={18} strokeWidth={3} />
            Otras
          </button>
        ) : null}
        <a
          className={secondaryButton}
          href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(withShareOrigin(shareUrl, "x"))}`}
          rel="noopener noreferrer"
          target="_blank"
          onClick={() => trackShare(props, "x")}
        >
          <XIcon />X
        </a>
        <button className={secondaryButton} type="button" onClick={copyLink}>
          <Copy size={18} strokeWidth={3} />
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>

      {storyFile ? (
        <button
          className="focus-ring mt-3 flex w-full items-center justify-center gap-2 border-4 border-ink bg-mustard px-4 py-3 text-sm font-black uppercase"
          type="button"
          onClick={shareStory}
        >
          <Instagram size={18} strokeWidth={3} />
          Imagen para historia
        </button>
      ) : (
        <a
          className="focus-ring mt-3 flex w-full items-center justify-center gap-2 border-4 border-ink bg-mustard px-4 py-3 text-sm font-black uppercase"
          download="testometro-historia.png"
          href={storyPath}
          onClick={() => {
            trackShare(props, "story");
            setStoryHint(true);
          }}
        >
          <Instagram size={18} strokeWidth={3} />
          Descargar imagen para historia
        </a>
      )}

      {storyHint ? (
        <p className="mt-2 text-center text-xs font-bold text-ink/80">
          {storyFile ? "Copiamos tu link: en la historia" : "En tu historia"}, agrega el
          sticker de enlace para que tus amigos lleguen al test.
        </p>
      ) : null}

      <p className="mt-3 text-center text-xs font-semibold text-ink/60">
        El link muestra tu nickname, puntaje y grupo, no tus respuestas.{" "}
        <a className="underline" href={sharePath} rel="noopener" target="_blank">
          Ver cómo se ve
        </a>
      </p>
    </section>
  );
}
