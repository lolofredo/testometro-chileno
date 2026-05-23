import Link from "next/link";
import { Gauge, Trophy } from "lucide-react";

export function Header() {
  return (
    <header className="border-b-4 border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          className="focus-ring inline-flex items-center gap-3 rounded-sm"
          href="/"
        >
          <span className="grid size-10 place-items-center border-4 border-ink bg-tomato text-paper shadow-[4px_4px_0_#17120f]">
            <Gauge size={22} strokeWidth={3} />
          </span>
          <span>
            <span className="block text-lg font-black uppercase leading-none tracking-normal">
              Testómetro
            </span>
            <span className="block text-xs font-bold uppercase leading-none tracking-normal text-tomato">
              Chileno
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-extrabold uppercase">
          <Link className="focus-ring rounded-sm px-3 py-2 hover:bg-mustard" href="/tests">
            Tests
          </Link>
          <Link
            className="focus-ring hidden rounded-sm px-3 py-2 hover:bg-mustard sm:inline-flex"
            href="/rankings/rotometro-original"
          >
            <Trophy className="mr-2" size={16} />
            Ranking
          </Link>
        </nav>
      </div>
    </header>
  );
}
