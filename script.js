const clientId = '1329184069426348052';  // Replace with your bot's ID
const redirectUri = 'https://fenruko.github.io/index.html';
const scopes = ['identify', 'guilds'];
const responseType = 'token';

function getAccessToken() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get('access_token');
}

async function fetchUserData(token) {
  const res = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

async function fetchUserGuilds(token) {
  const res = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const all = await res.json();
  return all.filter(g => (g.permissions & 0x20) === 0x20); // Only guilds user can manage
}

// After page loads
const token = getAccessToken();
if (token) {
  fetchUserData(token).then(user => {
    const profile = document.createElement('div');
    profile.innerHTML = `<p>👋 Logged in as <strong>${user.username}#${user.discriminator}</strong></p>`;
    document.body.prepend(profile);
  });

  fetchUserGuilds(token).then(guilds => {
    const dropdown = document.getElementById('guild_id');
    dropdown.innerHTML = '<option value="">Select a server...</option>';
    guilds.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.name;
      dropdown.appendChild(opt);
    });
  });
}


document.getElementById('loginBtn').href =
  `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scopes.join('%20')}`;

function getAccessToken() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
}

async function getUser(token) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
}

async function getGuilds(token) {
  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const all = await res.json();
  return all.filter(g => (g.permissions & 0x20) === 0x20); // Only servers where user can MANAGE_GUILD
}

document.addEventListener("DOMContentLoaded", function () {
    const categories = document.querySelectorAll(".command-category h3");

    categories.forEach((category) => {
        category.addEventListener("click", function () {
            const dropdown = this.nextElementSibling;

            if (dropdown.classList.contains("active")) {
                dropdown.classList.remove("active");
            } else {
                document.querySelectorAll(".dropdown").forEach((d) => d.classList.remove("active"));
                dropdown.classList.add("active");
            }
        });
    });
});
const token = getAccessToken();
if (token) {
  getUser(token).then(user => {
    const welcome = document.createElement("p");
    welcome.innerHTML = `👋 Logged in as <strong>${user.username}#${user.discriminator}</strong>`;
    document.body.prepend(welcome);
  });

  getGuilds(token).then(guilds => {
    const dropdown = document.getElementById("guild_id");
    guilds.forEach(guild => {
      const option = document.createElement("option");
      option.value = guild.id;
      option.textContent = guild.name;
      dropdown.appendChild(option);
    });
  });
}


document.getElementById("loginBtn").href =
  "https://discord.com/oauth2/authorize?client_id=1329184069426348052&redirect_uri=https%3A%2F%2Ffenruko.github.io%2Findex.html&response_type=token&scope=identify%20guilds";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("antiraidForm");
  if (!form) return;

  const apiBase = "http://147.135.213.131:3000/api/antiraid/";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const gid = document.getElementById("guild_id").value.trim();
    if (!gid) return alert("Enter a guild ID");

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

    if (res.ok) {
      alert("✅ Configuration saved!");
    } else {
      alert("❌ Error saving settings.");
    }
  });

  // Auto-load config when guild ID is entered
  document.getElementById("guild_id").addEventListener("change", async () => {
    const gid = document.getElementById("guild_id").value.trim();
    if (!gid) return;

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

    document.getElementById("bot_age").value = data.bot_age_limit || 10;
    document.getElementById("log_channel").value = data.log_channel || "";
  });
});
