/**
 * PavingPatterns — blueprint-style SVG illustrations of the StreetPrint
 * standard stamp templates. Pure line work, drawn as repeating SVG patterns
 * so they stay crisp at any size. Server component — no client JS.
 *
 * Pattern vocabulary sourced from the product line: brick (running bond),
 * herringbone, cobblestone, slate/ashlar, fan — plus custom.
 */

const STROKE = "var(--text-secondary)";

function Tile({
  id,
  title,
  note,
  children,
  patternW,
  patternH,
  patternTransform,
}: {
  id: string;
  title: string;
  note: string;
  children: React.ReactNode;
  patternW: number;
  patternH: number;
  patternTransform?: string;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden group"
      style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <svg
        viewBox="0 0 288 176"
        className="w-full block"
        style={{ color: STROKE }}
        role="img"
        aria-label={`${title} paving pattern illustration`}
      >
        <defs>
          <pattern id={id} width={patternW} height={patternH} patternUnits="userSpaceOnUse" patternTransform={patternTransform}>
            {children}
          </pattern>
        </defs>
        <rect width="288" height="176" fill={`url(#${id})`} />
      </svg>
      <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{note}</p>
      </div>
    </div>
  );
}

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.3 } as const;

export default function PavingPatterns() {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Standard templates.
      </h2>
      <p className="text-sm leading-relaxed mb-8 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
        Twelve-plus standard stamp patterns, imprinted directly into the asphalt and sealed in
        StreetBond colour. The most-specified templates:
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Running bond brick */}
        <Tile id="pp-brick" title="Running Bond" note="Classic offset brick" patternW={64} patternH={32}>
          <rect x="0" y="0" width="64" height="16" {...S} />
          <line x1="32" y1="0" x2="32" y2="16" {...S} />
          <rect x="0" y="16" width="64" height="16" {...S} />
          <line x1="16" y1="16" x2="16" y2="32" {...S} />
          <line x1="48" y1="16" x2="48" y2="32" {...S} />
        </Tile>

        {/* Herringbone — true interlocking H/V brick pairs, rotated 45°.
            Lattice: for point (a,b) → H brick at (3a−b, a+b)·u spanning 2u×u,
            V brick at (3a−b+2, a+b)·u spanning u×2u. Rectangular period 4u. */}
        <Tile id="pp-herring" title="Herringbone" note="45° interlocking brick" patternW={32} patternH={32} patternTransform="rotate(45)">
          <g {...S}>
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i % 6) - 2;
              const b = Math.floor(i / 6) - 2;
              const u = 8;
              const hx = (3 * a - b) * u;
              const hy = (a + b) * u;
              if (hx < -16 || hx > 40 || hy < -16 || hy > 40) return null;
              return (
                <g key={i}>
                  <rect x={hx} y={hy} width={2 * u} height={u} />
                  <rect x={hx + 2 * u} y={hy} width={u} height={2 * u} />
                </g>
              );
            })}
          </g>
        </Tile>

        {/* Cobblestone */}
        <Tile id="pp-cobble" title="Cobblestone" note="Rounded sett stones" patternW={56} patternH={40}>
          <g {...S}>
            <rect x="2" y="2" width="24" height="16" rx="7" />
            <rect x="30" y="2" width="24" height="16" rx="7" />
            <rect x="-12" y="22" width="24" height="16" rx="7" />
            <rect x="16" y="22" width="24" height="16" rx="7" />
            <rect x="44" y="22" width="24" height="16" rx="7" />
          </g>
        </Tile>

        {/* Slate / ashlar */}
        <Tile id="pp-slate" title="Ashlar Slate" note="Mixed-size cut stone" patternW={96} patternH={64}>
          <g {...S}>
            <rect x="0" y="0" width="40" height="32" />
            <rect x="40" y="0" width="56" height="20" />
            <rect x="40" y="20" width="28" height="12" />
            <rect x="68" y="20" width="28" height="12" />
            <rect x="0" y="32" width="24" height="32" />
            <rect x="24" y="32" width="44" height="32" />
            <rect x="68" y="32" width="28" height="32" />
          </g>
        </Tile>

        {/* European fan */}
        <Tile id="pp-fan" title="European Fan" note="Radial cobble fans" patternW={80} patternH={40}>
          <g {...S}>
            {/* full fan at origin row */}
            <path d="M 0 40 A 40 40 0 0 1 80 40" />
            <path d="M 13 40 A 27 27 0 0 1 67 40" />
            <path d="M 26 40 A 14 14 0 0 1 54 40" />
            <path d="M 40 40 L 40 0 M 40 40 L 12 12 M 40 40 L 68 12" />
            {/* half-drop fans peeking from the row above */}
            <path d="M -40 0 A 40 40 0 0 1 40 0" transform="translate(0 0)" opacity="0" />
            <path d="M 40 0 A 40 40 0 0 0 80 27 M 40 0 A 40 40 0 0 1 0 27" />
          </g>
        </Tile>

        {/* Custom */}
        <Tile id="pp-custom" title="Custom" note="Your pattern, cut to order" patternW={48} patternH={48}>
          <g {...S} strokeDasharray="4 5">
            <rect x="6" y="6" width="36" height="36" rx="10" />
          </g>
        </Tile>
      </div>
    </section>
  );
}
