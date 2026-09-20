
// Fixed ambient background for the whole app: base color, three drifting
// glows, a faint masked grid, film grain, and a vignette. Every page sits on
// top of this, so sections no longer need their own dot/grid patterns.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Background() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-[#05060a]">
      <div className="absolute -top-[18%] -left-[12%] h-[58vw] w-[58vw] rounded-full bg-[#5865f2]/[0.14] blur-[130px] animate-drift-slow" />
      <div className="absolute top-[28%] -right-[16%] h-[46vw] w-[46vw] rounded-full bg-[#00b8ff]/[0.09] blur-[130px] animate-drift-slower" />
      <div className="absolute -bottom-[22%] left-[16%] h-[42vw] w-[42vw] rounded-full bg-[#7c3aed]/[0.08] blur-[130px] animate-drift-slow" />

      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 90% 65% at 50% 0%, black 0%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 65% at 50% 0%, black 0%, transparent 78%)",
        }}
      />

      <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: NOISE }} />

      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 120% 90% at 50% 10%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
