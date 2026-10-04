"use client";

import { useEffect, useRef, type ReactNode } from "react";
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
  children
}: {
  sharedTestSlug: string;
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      className={className}
      href={href}
      onClick={() => {
        markArrivedFromShare();
        trackEvent("shared_link_cta_click", { testSlug: sharedTestSlug });
      }}
    >
      {children}
    </Link>
  );
}
