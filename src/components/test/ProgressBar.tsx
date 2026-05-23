export function ProgressBar({
  answered,
  total
}: {
  answered: number;
  total: number;
}) {
  const percentage = total === 0 ? 0 : Math.round((answered / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-black uppercase">
        <span>{answered} respondidas</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-5 border-4 border-ink bg-white">
        <div
          className="h-full bg-mint transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
