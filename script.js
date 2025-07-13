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
