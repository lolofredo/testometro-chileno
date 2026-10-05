"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  captureReviewMode,
  getReviewFormat,
  questionFormatLabels,
  type QuestionFormat
} from "@/lib/review-mode";

// Aviso fijo mientras el modo revisión está activo (ver lib/review-mode.ts).
export function ReviewModeBanner() {
  const pathname = usePathname();
  const [format, setFormat] = useState<QuestionFormat | null>(null);

  useEffect(() => {
    captureReviewMode(window.location.href);
    setFormat(getReviewFormat());
  }, [pathname]);

  if (!format) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center pt-[env(safe-area-inset-top)]">
      <p className="pointer-events-auto rounded-b-lg bg-ink px-3 py-1.5 text-center text-xs font-bold text-paper">
        Modo revisión · {questionFormatLabels[format]} · no se anota nada ·{" "}
        <a className="underline" href={`${pathname}?revisar=no`}>
          Salir
        </a>
      </p>
    </div>
  );
}
