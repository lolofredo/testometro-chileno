import Link from "next/link";
import { Gauge } from "@/components/brand/Gauge";
import { HeaderNav } from "./HeaderNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 py-2 pl-4 pr-2 sm:box-content sm:px-6">
        <Link className="focus-ring inline-flex min-w-0 items-center gap-2 rounded-lg" href="/">
          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-ink">
            <Gauge size={28} tone="dark" value={0.78} />
          </span>
          <span className="min-w-0 font-display uppercase leading-[0.92]">
            <span className="block text-[14px] sm:text-lg">Testómetro</span>
            <span className="block text-[10.5px] tracking-[0.05em] text-tomato sm:text-xs">Chileno</span>
          </span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
