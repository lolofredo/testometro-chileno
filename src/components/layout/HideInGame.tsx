"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Pantallas de "modo juego" (responder y resultado): van a pantalla completa
// del color del test, sin el encabezado ni el pie del sitio.
const gamePaths = [/^\/tests\/[^/]+\/(play|start)\/?$/, /^\/results\//];

export function isGamePath(pathname: string) {
  return gamePaths.some((pattern) => pattern.test(pathname));
}

export function HideInGame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return isGamePath(pathname) ? null : <>{children}</>;
}
