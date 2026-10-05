import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-[13px] uppercase">Testómetro Chileno</p>
          <p className="mt-1 max-w-2xl text-paper/75">
            Tests chilenos de humor para reírse y compartir. El Rotómetro Original
            se publica tal como circuló en los 2000.
          </p>
        </div>
        <nav className="flex gap-5 text-xs font-bold uppercase text-paper/80">
          <Link className="focus-ring inline-flex min-h-11 items-center underline-offset-4 hover:underline" href="/about">
            Sobre el proyecto
          </Link>
          <Link className="focus-ring inline-flex min-h-11 items-center underline-offset-4 hover:underline" href="/rankings">
            Rankings
          </Link>
        </nav>
      </div>
    </footer>
  );
}
