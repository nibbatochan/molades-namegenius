/**
 * Engine-turned line work, computed rather than drawn.
 *
 * A guilloche is what a geometric lathe produces: one stylus tracing a curve
 * while the bed rotates under it. Both figures here are the real geometry —
 * interlaced harmonic waves for the band, an epitrochoid for the rosette — so
 * the pattern holds its character at any width and in either stock. All maths
 * is deterministic, so the server and the client draw the same curve.
 */

const TAU = Math.PI * 2;

/** One harmonic wave, periodic across the tile so the band repeats seamlessly. */
function wavePath(
  tile: number,
  height: number,
  amp: number,
  phase: number,
  harmonic: number,
): string {
  const steps = 120;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * tile;
    const t = (i / steps) * TAU;
    const y =
      height / 2 +
      amp * Math.sin(t + phase) +
      amp * 0.44 * Math.sin(harmonic * t + phase * 1.7);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

/**
 * The braid: many phase-shifted copies of the same wave. Where the curves
 * crowd, the eye reads a rope; where they part, a lens. That interference is
 * the whole effect, so the count matters more than the stroke.
 */
function bandPaths(tile: number, height: number, curves: number) {
  const amp = height * 0.3;
  return Array.from({ length: curves }, (_, i) => {
    const phase = (i / curves) * TAU;
    return wavePath(tile, height, amp * (1 - (i % 3) * 0.13), phase, 3);
  });
}

export function GuillocheBand({
  height = 84,
  tile = 168,
  curves = 13,
  className = "",
}: {
  height?: number;
  tile?: number;
  curves?: number;
  className?: string;
}) {
  const id = `gb-${height}-${tile}-${curves}`;
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height={height}
      viewBox={`0 0 ${tile} ${height}`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <defs>
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={tile}
          height={height}
        >
          {bandPaths(tile, height, curves).map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.44}
              strokeWidth={0.5}
            />
          ))}
        </pattern>
      </defs>
      <rect width={tile} height={height} fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * The rosette that sits at the centre of a certificate: an epitrochoid, where
 * a point offset from a rolling circle's centre traces a many-lobed flower.
 * The lobe count is (R + r) / gcd(R, r) — 41 lobes at these settings.
 */
function epitrochoid(R: number, r: number, d: number, size: number): string {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const turns = r / gcd(R, r);
  const steps = 1600;
  const c = size / 2;
  const scale = (size / 2 - 1) / (R + r + d);
  let path = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU * turns;
    const k = (R + r) / r;
    const x = c + scale * ((R + r) * Math.cos(t) - d * Math.cos(k * t));
    const y = c + scale * ((R + r) * Math.sin(t) - d * Math.sin(k * t));
    path += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${path}Z`;
}

export function GuillocheRosette({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      <path
        d={epitrochoid(34, 7, 25, size)}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={0.45}
      />
      <path
        d={epitrochoid(26, 5, 17, size)}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.36}
        strokeWidth={0.4}
      />
    </svg>
  );
}

/**
 * A section divider in the register's own vocabulary: a hairline broken by a
 * small rosette, the way a ruled page breaks a rule to admit an ornament.
 */
export function RuleOrnament({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-5 text-rule ${className}`}
      aria-hidden="true"
    >
      <span className="h-hair flex-1 bg-rule" />
      <span className="text-ink-3">
        <GuillocheRosette size={26} />
      </span>
      <span className="h-hair flex-1 bg-rule" />
    </div>
  );
}
