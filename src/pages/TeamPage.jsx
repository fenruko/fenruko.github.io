import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ScrollReveal from "../components/ScrollReveal";

// TODO: replace with fenruko's real Discord user ID
const FENRUKO_DISCORD_ID = "834869554798395392";
// Shown until the Lanyard fetch resolves, or if it fails
const FALLBACK_AVATAR = "https://i.postimg.cc/qR4jqJdK/cropped_circle_image.png";

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

export default function TeamPage() {
  const fenrukoAvatar = useLanyardAvatar(FENRUKO_DISCORD_ID);

  return (
    <div className="min-h-screen bg-[#08090c] pt-32 pb-24 px-4">
      <Helmet>
        <title>Team - Rift</title>
      </Helmet>
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">The Team</h1>
          <p className="text-white/40 text-[15px] max-w-xl mx-auto leading-relaxed mb-14">
            The person behind Rift.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="inline-block bg-white/[0.02] rounded-2xl border border-white/[0.06] p-8 text-left max-w-sm">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={fenrukoAvatar}
              alt="fenruko"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <div className="text-white font-semibold text-lg">fenruko</div>
              <div className="text-white/40 text-sm">Sole Owner & Lead Developer</div>
            </div>
          </div>
          <p className="text-white/40 text-[14px] leading-relaxed">
            fenruko is the sole owner of Rift and the lead developer behind the project.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}