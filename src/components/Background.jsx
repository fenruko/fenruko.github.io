// Fixed ambient background: near-black, a diagonal beam of violet/cyan light
// (the "rift") cutting across the top, faint hatch lines, grain, vignette.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Background() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* the beam */}
      <div
        className="absolute left-1/2 top-[-6%] h-[22vh] w-[150vw] -translate-x-1/2 -rotate-[11deg] animate-drift-slow opacity-80 blur-[70px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(138,125,255,0.38) 35%, rgba(53,224,255,0.28) 65%, transparent)" }}
      />
      <div className="absolute -bottom-[25%] -left-[10%] h-[45vw] w-[45vw] rounded-full bg-[#8a7dff]/[0.07] blur-[140px] animate-drift-slower" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 26px)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
        }}
      />

      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: NOISE }} />

      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 120% 90% at 50% 15%, transparent 55%, rgba(0,0,0,0.65) 100%)" }}
      />
    </div>
  );
}
