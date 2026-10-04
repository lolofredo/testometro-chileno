"use client";

import { useEffect } from "react";
import { captureVisitOrigin } from "@/lib/analytics/origin";

// Fija de dónde llegó la persona al entrar al sitio (ver lib/analytics/origin.ts).
export function VisitOriginTracker() {
  useEffect(() => {
    captureVisitOrigin(window.location.href, document.referrer);
  }, []);

  return null;
}
