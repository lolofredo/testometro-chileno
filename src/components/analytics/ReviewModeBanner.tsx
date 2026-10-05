"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  captureReviewMode,
  getReviewFormat,
  questionFormatLabels,
  type QuestionFormat
} from "@/lib/review-mode";

// Franja arriba de todo mientras el modo revisión está activo (ver lib/review-mode.ts).
export function ReviewModeBanner() {
  const pathname = usePathname();
  const [format, setFormat] = useState<QuestionFormat | null>(null);

  useEffect(() => {
    captureReviewMode(window.location.href);
    setFormat(getReviewFormat());
  }, [pathname]);

  if (!format) return null;

  return (
    <p className="bg-ink px-3 pb-1.5 pt-[max(6px,env(safe-area-inset-top))] text-center text-xs font-bold text-paper">
      Modo revisión · {questionFormatLabels[format]} · no se anota nada ·{" "}
      <a className="underline" href={`${pathname}?revisar=no`}>
        Salir
      </a>
    </p>
  );
}
