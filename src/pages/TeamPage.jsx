import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ScrollReveal from "../components/ScrollReveal";

// Shown until the Lanyard fetch resolves, or if it fails
const FALLBACK_AVATAR = "https://i.postimg.cc/qR4jqJdK/cropped_circle_image.png";

const TEAM = [
  {
    name: "fenruko",
    discordId: "834869554798395392", // TODO: replace with fenruko's real Discord user ID
    role: "Founder",
    bio: "fenruko is the founder of Rift and the lead developer behind the project.",
  },
  {
    name: "yoru.me.uk/yoru.bun",
    discordId: "1512032332163448880",
    role: "CEO",
    bio: "yoru.me.uk is the CEO of Rift, overseeing staff and operations of the bot globally.",
  },
  {
    name: "sreeharip.s_",
    discordId: "1398695684869459989",
    role: "COO",
    bio: "sreeharip.s_ is the COO of Rift, second in command to the CEO and oversees daily operations .",
  },
  {
    name: "reddevss",
    discordId: "1295530404727492709",
    role: "CDO/CSO",
    bio: "reddevss is the CDO and CSO of Rift, managing general security and bussiness strategies, Basically the guardian of the bot.",
  },
  {
    name: "dndboner",
    discordId: "164761668256137216",
    role: "Chief Social Officer",
    bio: "dndboner is the CSO of Rift, managing social media posts and reach strategies, along with server partnerships to increase reach.",
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
      className="inline-block bg-white/[0.02] rounded-2xl border border-white/[0.06] p-8 text-left max-w-sm"
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={avatar}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <div className="text-white font-semibold text-lg">{name}</div>
          <div className="text-white/40 text-sm">{role}</div>
        </div>
      </div>
      <p className="text-white/40 text-[14px] leading-relaxed">{bio}</p>
    </ScrollReveal>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#08090c] pt-32 pb-24 px-4">
      <Helmet>
        <title>Team - Rift</title>
      </Helmet>
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">The Team</h1>
          <p className="text-white/40 text-[15px] max-w-xl mx-auto leading-relaxed mb-14">
            The people behind Rift.
          </p>
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