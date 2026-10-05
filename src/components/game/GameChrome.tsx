import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { testThemeStyle } from "@/lib/tests/theme";

// Pantalla completa del color del test (responder, nombre y resultado).
export function GameScreen({ testSlug, children }: { testSlug: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-test text-test-on" style={testThemeStyle(testSlug)}>
      {children}
    </div>
  );
}

export function GameTopBar({
  exitHref,
  exitLabel = "Salir",
  center,
  right
}: {
  exitHref: string;
  exitLabel?: string;
  center?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 pb-2.5 pt-[max(10px,env(safe-area-inset-top))] text-[13px] font-black uppercase tracking-[0.03em]">
      <Link className="focus-ring -ml-2 inline-flex min-h-11 w-fit items-center gap-0.5 rounded-lg pl-1 pr-2" href={exitHref}>
        <ChevronLeft aria-hidden="true" size={18} strokeWidth={2.8} />
        {exitLabel}
      </Link>
      <span className="truncate text-center">{center}</span>
      <span className="text-right tabular-nums">{right}</span>
    </div>
  );
}

export function GameProgress({ value, label }: { value: number; label: string }) {
  const percentage = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={percentage}
      className="h-2 overflow-hidden rounded-md bg-ink/20"
      role="progressbar"
    >
      <div className="h-full rounded-md bg-paper transition-[width]" style={{ width: `${percentage}%` }} />
    </div>
  );
}
