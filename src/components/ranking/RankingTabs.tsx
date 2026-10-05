"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { testThemeStyle } from "@/lib/tests/theme";

type Tab = { slug: string; title: string; panel: ReactNode };

const hashPrefix = "#ranking-";

// Una pestaña por test. Todos los rankings están en la página (Google los
// lee todos); las pestañas solo muestran uno a la vez. Los links antiguos
// /rankings#ranking-<test> abren directo su pestaña.
export function RankingTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.slug);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fromHash(scroll: boolean) {
      const slug = window.location.hash.startsWith(hashPrefix)
        ? window.location.hash.slice(hashPrefix.length)
        : null;
      if (!slug || !tabs.some((tab) => tab.slug === slug)) return;
      setActive(slug);
      if (scroll) barRef.current?.scrollIntoView({ block: "start" });
    }

    fromHash(true);
    const onHashChange = () => fromHash(false);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [tabs]);

  function select(slug: string) {
    setActive(slug);
    window.history.replaceState(null, "", `${hashPrefix}${slug}`);
  }

  return (
    <div>
      <div className="sticky top-[65px] z-10 -mx-4 scroll-mt-20 bg-canvas/95 px-4 py-2 backdrop-blur sm:mx-0 sm:px-0" ref={barRef}>
        <div className="flex flex-wrap gap-2" role="tablist">
          {tabs.map((tab) => {
            const selected = tab.slug === active;
            return (
              <button
                aria-controls={`ranking-${tab.slug}`}
                aria-selected={selected}
                className={`focus-ring min-h-11 shrink-0 rounded-full border-2 border-test px-4 text-[13px] font-black uppercase tracking-[0.03em] ${
                  selected ? "bg-test text-test-on" : "bg-white text-ink"
                }`}
                key={tab.slug}
                onClick={() => select(tab.slug)}
                role="tab"
                style={testThemeStyle(tab.slug)}
                type="button"
              >
                {tab.title}
              </button>
            );
          })}
        </div>
      </div>

      {tabs.map((tab) => (
        <div hidden={tab.slug !== active} id={`ranking-${tab.slug}`} key={tab.slug} role="tabpanel">
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
