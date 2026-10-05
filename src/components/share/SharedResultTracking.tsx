"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { markArrivedFromShare, trackEvent } from "@/lib/analytics/events";

// Cuenta una apertura del resultado compartido. Las vistas previas de
// WhatsApp o X no ejecutan JavaScript, así que no suman.
export function TrackSharedOpen({ testSlug }: { testSlug: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("shared_link_opened", { testSlug });
  }, [testSlug]);

  return null;
}

// Link hacia un test desde un resultado compartido: anota el clic y marca
// que el test que empiece esta persona vino de un link compartido.
export function ShareCtaLink({
  sharedTestSlug,
  href,
  className,
  style,
  children
}: {
  sharedTestSlug: string;
  href: string;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Link
      className={className}
      href={href}
      style={style}
      onClick={() => {
        markArrivedFromShare();
        trackEvent("shared_link_cta_click", { testSlug: sharedTestSlug });
      }}
    >
      {children}
    </Link>
  );
}

// Barra fija abajo con la invitación: solo cuando el botón principal no está
// a la vista, para que nunca se vean dos botones iguales a la vez.
export function SharedStickyCta({
  sharedTestSlug,
  targetId,
  href,
  label
}: {
  sharedTestSlug: string;
  targetId: string;
  href: string;
  label: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  if (!visible) return null;

  return (
    <div className="sticky bottom-[var(--cookie-bar,0px)] z-20 bg-canvas/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
      <ShareCtaLink
        className="focus-ring flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-test px-4 text-sm font-black uppercase text-test-on shadow-lift"
        href={href}
        sharedTestSlug={sharedTestSlug}
      >
        {label}
      </ShareCtaLink>
    </div>
  );
}
