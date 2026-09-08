/**
 * Lightweight responsive area chart drawn as inline SVG.
 * Scales with its container via viewBox — no measuring, no layout shift.
 */
export type SeriesPoint = { month: string; quoted: number; collected: number };

const W = 640;
const H = 260;
const PAD = { top: 16, right: 12, bottom: 28, left: 36 };

function path(values: number[], max: number, close: boolean) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const step = values.length > 1 ? innerW / (values.length - 1) : 0;
  const pts = values.map((v, i) => [PAD.left + i * step, PAD.top + innerH - (v / max) * innerH] as const);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  if (!close) return line;
  const last = pts[pts.length - 1]!;
  const first = pts[0]!;
  return `${line} L${last[0].toFixed(1)},${PAD.top + innerH} L${first[0].toFixed(1)},${PAD.top + innerH} Z`;
}

export function StudioAreaChart({ data }: { data: SeriesPoint[] }) {
  const quoted = data.map((d) => d.quoted);
  const collected = data.map((d) => d.collected);
  const max = Math.max(...quoted, ...collected) * 1.15 || 1;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <figure className="m-0 w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full sm:h-64" role="img" aria-label="Quoted versus collected revenue by month">
        <defs>
          <linearGradient id="ac-quoted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="ac-collected" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {ticks.map((t) => {
          const y = PAD.top + innerH - t * innerH;
          return (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={PAD.left + innerW}
                y1={y}
                y2={y}
                stroke="var(--color-border)"
                strokeDasharray="3 3"
              />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="fill-muted-foreground" fontSize="11">
                {Math.round(t * max)}
              </text>
            </g>
          );
        })}

        <path d={path(quoted, max, true)} fill="url(#ac-quoted)" />
        <path d={path(quoted, max, false)} fill="none" stroke="var(--color-chart-1)" strokeWidth="2.5" />
        <path d={path(collected, max, true)} fill="url(#ac-collected)" />
        <path d={path(collected, max, false)} fill="none" stroke="var(--color-chart-3)" strokeWidth="2.5" />

        {data.map((d, i) => {
          const step = data.length > 1 ? innerW / (data.length - 1) : 0;
          return (
            <text
              key={d.month}
              x={PAD.left + i * step}
              y={H - 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="11"
            >
              {d.month}
            </text>
          );
        })}
      </svg>
      <figcaption className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: "var(--color-chart-1)" }} /> Quoted
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: "var(--color-chart-3)" }} /> Collected
        </span>
      </figcaption>
    </figure>
  );
}
