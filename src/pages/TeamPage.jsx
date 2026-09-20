import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ScrollReveal from "../components/ScrollReveal";

// Shown until the Lanyard fetch resolves, or if it fails
const FALLBACK_AVATAR = "https://i.postimg.cc/qR4jqJdK/cropped_circle_image.png";

const TEAM = [
  {
    name: "fenruko",
    discordId: "834869554798395392",
    role: "Founder",
    bio: "Founder of Rift and the lead developer behind the project.",
  },
  {
    name: ".rdns",
    discordId: "1538964751902838835",
    role: "CEO",
    bio: "Oversees staff and operations of the bot globally.",
  },
  {
    name: "sreeharip.s_",
    discordId: "1398695684869459989",
    role: "COO",
    bio: "Second in command to the CEO; oversees daily operations.",
  },
];

function useLanyardAvatar(discordId) {
  const [avatarUrl, setAvatarUrl] = useState(FALLBACK_AVATAR);

  useEffect(() => {
    let cancelled = false;

    fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json?.success) return;
        const { id, avatar } = json.data.discord_user;
        if (avatar) {
          const ext = avatar.startsWith("a_") ? "gif" : "png";
          setAvatarUrl(`https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}?size=128`);
        }
      })
      .catch(() => {
        // Lanyard down or user not in the Lanyard support server — keep fallback
      });

    return () => {
      cancelled = true;
    };
  }, [discordId]);

  return avatarUrl;
}

function TeamMemberCard({ name, discordId, role, bio, delay }) {
  const avatar = useLanyardAvatar(discordId);

  return (
    <ScrollReveal
      delay={delay}
      className="inline-block max-w-sm rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 text-left backdrop-blur-sm transition-colors duration-300 hover:border-white/[0.16]"
    >
      <div className="mb-4 flex items-center gap-4">
        <img src={avatar} alt={name} className="h-14 w-14 rounded-full object-cover ring-1 ring-white/15" />
        <div>
          <div className="text-lg font-semibold text-white">{name}</div>
          <div className="cmd text-[12px] text-white/40">{role}</div>
        </div>
      </div>
      <p className="text-[14px] leading-relaxed text-white/40">{bio}</p>
    </ScrollReveal>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen px-4 pb-24 pt-32">
      <Helmet>
        <title>Team - Rift</title>
      </Helmet>
      <div className="mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <h1 className="mb-4 text-4xl font-semibold text-white md:text-5xl">The Team</h1>
          <p className="mx-auto mb-14 max-w-xl text-[15px] leading-relaxed text-white/40">The people behind Rift.</p>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-6">
          {TEAM.map((member, i) => (
            <TeamMemberCard key={member.name} {...member} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}
