"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Laugh, ListChecks, Trophy, type LucideIcon } from "lucide-react";

const items: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/tests", label: "Tests", Icon: ListChecks },
  { href: "/rankings", label: "Rankings", Icon: Trophy },
  { href: "/memes", label: "Memes", Icon: Laugh }
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 items-center gap-0.5 sm:gap-1">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`focus-ring inline-flex min-h-12 min-w-[58px] flex-col items-center justify-center gap-[3px] rounded-[10px] px-1.5 text-[10px] font-extrabold uppercase tracking-[0.04em] sm:min-h-11 sm:flex-row sm:gap-2 sm:px-3.5 sm:text-[13px] ${
              active ? "bg-ink text-paper" : "hover:bg-ink/5"
            }`}
            href={href}
            key={href}
          >
            <Icon aria-hidden="true" size={20} strokeWidth={2.4} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
