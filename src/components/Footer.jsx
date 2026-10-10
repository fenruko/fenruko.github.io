import { Link } from "react-router-dom";
import { FaDiscord } from "react-icons/fa6";
import Button from "./ui/Button";

const RIFT_LOGO = "/assets/riftlogo.jpg";
const SUPPORT_SERVER_URL = "https://discord.gg/kqTPMyeteG";

export default function Footer() {
  return (
    <footer className="relative mt-10 px-4 pb-10 sm:px-6">
      {/* the seam, once more */}
      <div aria-hidden="true" className="mx-auto mb-12 h-px max-w-6xl" style={{ background: "var(--seam)", boxShadow: "0 0 14px rgba(138,125,255,0.55)" }} />

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-[1.6fr,1fr,1fr]">
          <div>
            <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
              <img src={RIFT_LOGO} alt="Rift" className="logo-oct h-9 w-9 object-cover" />
              <span className="font-heading text-lg font-semibold lowercase text-white">rift</span>
            </Link>
            <p className="max-w-[320px] text-[13.5px] leading-relaxed text-white/45">
              A Discord bot with 75+ modules. Configured from the dashboard, driven by slash commands.
            </p>
          </div>

          <div>
            <h5 className="cmd mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a7dff]">{"// site"}</h5>
            <div className="flex flex-col space-y-2 text-[13.5px] text-white/50">
              <Link to="/" className="transition-colors hover:text-white">Home</Link>
              <Link to="/commands" className="transition-colors hover:text-white">Commands</Link>
              <a href="https://docs.rift.cool" className="transition-colors hover:text-white">Docs</a>
              <Link to="/team" className="transition-colors hover:text-white">Team</Link>
              <a href="https://dash.rift.cool" className="transition-colors hover:text-white">Dashboard</a>
              <a href="/bug-report.html" className="transition-colors hover:text-white">Report a bug</a>
              <a href="https://staff.rift.cool" className="transition-colors hover:text-white">Ban appeals</a>
            </div>
          </div>

          <div>
            <h5 className="cmd mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#35e0ff]">{"// support"}</h5>
            <p className="text-[13.5px] leading-relaxed text-white/45">
              Help, feedback, and updates live in the community server.
            </p>
            <Button href={SUPPORT_SERVER_URL} external size="sm" className="mt-4">
              <FaDiscord className="h-4 w-4" />
              Join the Discord
            </Button>
          </div>
        </div>

        <div className="cmd flex items-center justify-between border-t border-white/[0.06] pt-6 text-[11.5px] text-white/30">
          <span>&copy; {new Date().getFullYear()} Rift.</span>
          <span className="hidden sm:inline">rift://home</span>
        </div>
      </div>
    </footer>
  );
}
