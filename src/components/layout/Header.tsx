import Link from "next/link";
import { Gauge, Images, ListChecks, Trophy } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4">
        <Link
          className="focus-ring inline-flex min-w-0 items-center gap-2 rounded-sm sm:gap-3"
          href="/"
        >
          <span className="grid size-9 shrink-0 place-items-center border-4 border-ink bg-tomato text-paper shadow-[4px_4px_0_#17120f] sm:size-10">
            <Gauge size={20} strokeWidth={3} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black uppercase leading-none tracking-normal sm:text-lg">
              Testómetro
            </span>
            <span className="block text-xs font-bold uppercase leading-none tracking-normal text-tomato">
              Chileno
            </span>
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-1 text-xs font-extrabold uppercase sm:gap-2 sm:text-sm">
          <Link
            aria-label="Ver tests"
            className="focus-ring inline-flex items-center gap-1 rounded-sm px-2 py-2 hover:bg-mustard sm:px-3"
            href="/tests"
          >
            <ListChecks size={15} strokeWidth={3} />
            <span className="hidden sm:inline">Tests</span>
          </Link>
          <Link
            aria-label="Ver memes"
            className="focus-ring inline-flex items-center gap-1 rounded-sm px-2 py-2 hover:bg-mustard sm:px-3"
            href="/memes"
          >
            <Images size={15} strokeWidth={3} />
            <span className="hidden sm:inline">Memes</span>
          </Link>
          <Link
            aria-label="Ver rankings"
            className="focus-ring inline-flex items-center gap-1 rounded-sm px-2 py-2 hover:bg-mustard sm:px-3"
            href="/rankings"
          >
            <Trophy size={15} strokeWidth={3} />
            <span className="hidden sm:inline">Rankings</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
