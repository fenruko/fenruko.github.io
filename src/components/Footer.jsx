import { Link } from "react-router-dom";
import { FaDiscord } from "react-icons/fa6";
import Button from "./ui/Button";

const RIFT_LOGO = "https://i.postimg.cc/qR4jqJdK/cropped_circle_image.png";
const SUPPORT_SERVER_URL = "https://discord.gg/kqTPMyeteG";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#04050a]/60 px-4 py-14 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-[1.6fr,1fr,1fr]">
          <div>
            <Link to="/" className="mb-4 inline-flex items-center gap-3">
              <img src={RIFT_LOGO} alt="Rift" className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15" />
              <span className="text-lg font-bold text-white">Rift</span>
            </Link>
            <p className="max-w-[320px] text-[13px] leading-relaxed text-white/35">
              A Discord bot with 75+ modules. Configured from the dashboard, driven by slash commands.
            </p>
          </div>

          <div>
            <h5 className="cmd mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">Site</h5>
            <div className="flex flex-col space-y-2 text-[13px] text-white/45">
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
            <h5 className="cmd mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">Support</h5>
            <p className="text-[13px] leading-relaxed text-white/35">Help, feedback, and updates live in the community server.</p>
            <Button href={SUPPORT_SERVER_URL} external size="sm" className="mt-4">
              <FaDiscord className="h-4 w-4" />
              Join the Discord
            </Button>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6 text-[12px] text-white/35">
          &copy; {new Date().getFullYear()} Rift.
        </div>
      </div>
    </footer>
  );
}
