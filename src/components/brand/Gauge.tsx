// La aguja del "-ómetro": sello de la marca. `value` va de 0 (izquierda) a 1
// (derecha); sobre 1 se sale de la escala. `sweep` hace un barrido corto al
// cargar (se omite si el teléfono pide reducir movimiento, ver globals.css).

const zones = { low: "#2bbf8a", mid: "#f3b61f", high: "#c8321d" };

export function Gauge({
  value,
  size,
  tone = "light",
  ticks = false,
  sweep = false,
  className
}: {
  value: number;
  size: number;
  tone?: "light" | "dark";
  ticks?: boolean;
  sweep?: boolean;
  className?: string;
}) {
  const angle = Math.max(-10, Math.min(value, 1.12)) * 180;
  const track = tone === "dark" ? "#3a322c" : "#ece4d2";
  const needle = tone === "dark" ? "#fff8e7" : "#17120f";

  return (
    <svg
      aria-hidden="true"
      className={className}
      height={Math.round(size * 0.6)}
      viewBox="0 0 220 132"
      width={size}
    >
      <path d="M20 112 A90 90 0 0 1 200 112" fill="none" stroke="#17120f" strokeWidth="30" />
      <path d="M20 112 A90 90 0 0 1 200 112" fill="none" stroke={track} strokeWidth="22" />
      <path d="M20 112 A90 90 0 0 1 65 34" fill="none" stroke={zones.low} strokeWidth="22" />
      <path d="M65 34 A90 90 0 0 1 155 34" fill="none" stroke={zones.mid} strokeWidth="22" />
      <path d="M155 34 A90 90 0 0 1 200 112" fill="none" stroke={zones.high} strokeWidth="22" />
      {ticks
        ? Array.from({ length: 11 }, (_, index) => {
            const tickAngle = Math.PI * (1 - index / 10);
            const major = index % 5 === 0;
            const inner = major ? 50 : 56;
            return (
              <line
                key={index}
                opacity="0.8"
                stroke={needle}
                strokeLinecap="round"
                strokeWidth={major ? 4 : 2.5}
                x1={(110 + inner * Math.cos(tickAngle)).toFixed(1)}
                x2={(110 + 64 * Math.cos(tickAngle)).toFixed(1)}
                y1={(112 - inner * Math.sin(tickAngle)).toFixed(1)}
                y2={(112 - 64 * Math.sin(tickAngle)).toFixed(1)}
              />
            );
          })
        : null}
      <g transform={`rotate(${angle.toFixed(1)} 110 112)`}>
        <g className={sweep ? "gauge-sweep" : undefined}>
          <line stroke={needle} strokeLinecap="round" strokeWidth="9" x1="110" x2="34" y1="112" y2="112" />
        </g>
      </g>
      <circle cx="110" cy="112" fill={needle} r="13" />
    </svg>
  );
}
