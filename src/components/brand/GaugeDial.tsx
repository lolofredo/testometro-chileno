import { Gauge } from "./Gauge";

// La aguja sobre un medio disco claro, para que su zona roja (o amarilla o
// verde) no se pierda sobre el fondo del mismo color del test.
export function GaugeDial({ value, size, sweep = false }: { value: number; size: number; sweep?: boolean }) {
  return (
    <div className="mx-auto w-fit rounded-t-[999px] bg-paper px-4 pt-4" style={{ maxWidth: "100%" }}>
      <Gauge className="block h-auto max-w-full" size={size} sweep={sweep} ticks value={value} />
    </div>
  );
}
