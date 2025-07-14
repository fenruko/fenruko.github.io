const clientId = "1329184069426348052"; // Replace with your actual bot ID
const redirectUri = "https://fenruko.github.io/index.html";
const apiBase = "http://147.135.213.131:3000/api/antiraid/"; // Replace with your Flask IP

// Build login link
document.getElementById("loginBtn").href =
  `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=identify%20guilds`;

// OAuth helpers
function getAccessToken() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
}

async function fetchUser(token) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

async function fetchGuilds(token) {
  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.filter(g => (g.permissions & 0x20) === 0x20); // MANAGE_GUILD
}

// Main logic
document.addEventListener("DOMContentLoaded", () => {
  const token = getAccessToken();

  if (token) {
    fetchUser(token).then(user => {
      document.getElementById("userProfile").innerHTML =
        `👋 Logged in as <strong>${user.username}#${user.discriminator}</strong>`;
    });

    fetchGuilds(token).then(guilds => {
      const sel = document.getElementById("guild_id");
      sel.innerHTML = '<option value="">Select your server...</option>';
      guilds.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = g.name;
        sel.appendChild(opt);
      });

      sel.addEventListener("change", async () => {
        const gid = sel.value;
        const res = await fetch(apiBase + gid);
        if (!res.ok) return alert("No config found.");

        const data = await res.json();
        document.getElementById("join_enabled").checked = data.join_spike.enabled;
        document.getElementById("join_threshold").value = data.join_spike.threshold;
        document.getElementById("join_interval").value = data.join_spike.interval;
        document.getElementById("join_action").value = data.join_spike.action;

        document.getElementById("mention_enabled").checked = data.mention_spam.enabled;
        document.getElementById("mention_threshold").value = data.mention_spam.threshold;
        document.getElementById("mention_action").value = data.mention_spam.action;

        document.getElementById("msg_enabled").checked = data.message_spam.enabled;
        document.getElementById("msg_rate").value = data.message_spam.messages_per_5s;
        document.getElementById("msg_action").value = data.message_spam.action;

        document.getElementById("bot_age").value = data.bot_age_limit;
        document.getElementById("log_channel").value = data.log_channel;
      });
    });
  }

  const form = document.getElementById("antiraidForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const gid = document.getElementById("guild_id").value;
    if (!gid) return alert("Select a server");

    const payload = {
      join_spike: {
        enabled: document.getElementById("join_enabled").checked,
        threshold: parseInt(document.getElementById("join_threshold").value),
        interval: parseInt(document.getElementById("join_interval").value),
        action: document.getElementById("join_action").value
      },
      mention_spam: {
        enabled: document.getElementById("mention_enabled").checked,
        threshold: parseInt(document.getElementById("mention_threshold").value),
        action: document.getElementById("mention_action").value
      },
      message_spam: {
        enabled: document.getElementById("msg_enabled").checked,
        messages_per_5s: parseInt(document.getElementById("msg_rate").value),
        action: document.getElementById("msg_action").value
      },
      bot_age_limit: parseInt(document.getElementById("bot_age").value),
      log_channel: document.getElementById("log_channel").value
    };

    const res = await fetch(apiBase + gid, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) alert("✅ Configuration saved!");
    else alert("❌ Failed to save.");
  });
});
