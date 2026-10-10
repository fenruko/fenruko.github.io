// Fixed ambient background for the whole app: near-black base, a soft steel-blue
// glow at the top, a faint masked grid, light grain, and a vignette.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Background() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute -top-[22%] left-1/2 h-[60vw] w-[80vw] -translate-x-1/2 rounded-full bg-[#1f3e66]/40 blur-[140px] animate-drift-slow" />
      <div className="absolute top-[40%] -right-[18%] h-[40vw] w-[40vw] rounded-full bg-[#7aa2f7]/[0.07] blur-[130px] animate-drift-slower" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 80%)",
        }}
      />

      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: NOISE }} />

      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 120% 90% at 50% 10%, transparent 55%, rgba(0,0,0,0.6) 100%)" }}
      />
    </div>
  );
}
