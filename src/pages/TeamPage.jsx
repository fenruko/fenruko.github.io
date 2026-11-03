import { useEffect, useState } from "react";
import useTitle from "../useTitle";
import { LOGO_LARGE } from "../links";

const TEAM = [
  {
    name: "fenruko",
    discordId: "834869554798395392",
    role: "Founder",
    bio: "Founder of Rift and the lead developer behind the project.",
  },
];

// Shown until the Lanyard fetch resolves, or if it fails.
function useLanyardAvatar(discordId) {
  const [avatarUrl, setAvatarUrl] = useState(LOGO_LARGE);

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
        // Lanyard down or user not in the Lanyard support server: keep the fallback.
      });

    return () => {
      cancelled = true;
    };
  }, [discordId]);

  return avatarUrl;
}

function TeamMemberCard({ name, discordId, role, bio }) {
  const avatar = useLanyardAvatar(discordId);

  return (
    <article className="glass card member">
      <div className="member-head">
        <img src={avatar} width="56" height="56" alt="" className="logo" />
        <div>
          <div className="member-name">{name}</div>
          <div className="muted small">{role}</div>
        </div>
      </div>
      <p className="muted">{bio}</p>
    </article>
  );
}

export default function TeamPage() {
  useTitle("Team - Rift");

  return (
    <section className="page">
      <div className="wrap narrow">
        <h1 className="h1 h1-page">The Team</h1>
        <p className="lead">The people behind Rift.</p>
        <div className="team">
          {TEAM.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
}
