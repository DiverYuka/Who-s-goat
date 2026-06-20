interface EraFilterProps {
  startYear: number;
  endYear: number;
  onChange: (start: number, end: number) => void;
}

export function EraFilter({ startYear, endYear, onChange }: EraFilterProps) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-sm font-semibold text-zinc-100">年代區間</h3>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1946}
          max={endYear - 1}
          value={startYear}
          onChange={(event) => onChange(Number(event.target.value), endYear)}
          className="w-20 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-center font-mono text-sm text-zinc-100"
        />
        <span className="text-zinc-500">-</span>
        <input
          type="number"
          min={startYear + 1}
          max={2026}
          value={endYear}
          onChange={(event) => onChange(startYear, Number(event.target.value))}
          className="w-20 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-center font-mono text-sm text-zinc-100"
        />
      </div>

      <p className="mt-2 text-xs text-zinc-500">共 {endYear - startYear} 個賽季</p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onChange(1946, 1976)}
          className={`rounded border px-3 py-1 text-xs transition-colors ${
            startYear === 1946 && endYear === 1976
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
          }`}
        >
          合併前
        </button>
        <button
          onClick={() => onChange(1976, 2026)}
          className={`rounded border px-3 py-1 text-xs transition-colors ${
            startYear === 1976 && endYear === 2026
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
          }`}
        >
          合併後
        </button>
      </div>
    </section>
  );
}
