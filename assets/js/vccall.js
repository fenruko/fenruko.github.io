const VC_WS_URL = 'wss://desktop-mo3r1pj.tailb9e0a9.ts.net/ws/vc';
const VC_API    = 'https://desktop-mo3r1pj.tailb9e0a9.ts.net/api/vc';

let _vcWs           = null;
let _vcWsRetryDelay = 3000;
let _vcWsRetryTimer = null;
let _vcCallState    = null;
let _vcSpeaking     = {};
let _vcRingTimers   = {};
let _vcVisualizerOn = true;
let _vcRingPulseOn  = true;
let _vcGuildId      = null;
let _vcPollTimer    = null;
let _vcElapsedTimer = null;

/* ── Init ──────────────────────────────────────────────── */
window.initVcCall = function () {
    _vcVisualizerOn = _getVcPref('vcVisualizer', true);
    _vcRingPulseOn  = _getVcPref('vcRingPulse',  true);
    _syncVcPrefsUI();
    _connectVcWs();
    _startPoll();
};

/* ── Prefs ─────────────────────────────────────────────── */
function _getVcPref(key, def) {
    try {
        const s = localStorage.getItem('rift_prefs');
        if (s) return JSON.parse(s)[key] ?? def;
    } catch (_) {}
    return def;
}

function _syncVcPrefsUI() {
    const v = document.getElementById('prefVcVisualizer');
    const r = document.getElementById('prefVcRingPulse');
    if (v) v.checked = _vcVisualizerOn;
    if (r) r.checked = _vcRingPulseOn;
}

/* ── WebSocket ─────────────────────────────────────────── */
function _connectVcWs() {
    if (_vcWs && (_vcWs.readyState === WebSocket.OPEN || _vcWs.readyState === WebSocket.CONNECTING)) return;
    clearTimeout(_vcWsRetryTimer);
    _vcWs = new WebSocket(VC_WS_URL);

    _vcWs.onopen = () => {
        _vcWsRetryDelay = 3000;
        _setDot(true);
        _vcWsSend({ type: 'get_state' });
    };
    _vcWs.onmessage = (e) => {
        try { _handleMsg(JSON.parse(e.data)); } catch (_) {}
    };
    _vcWs.onclose = () => {
        _setDot(false);
        _vcWsRetryTimer = setTimeout(_connectVcWs, _vcWsRetryDelay);
        _vcWsRetryDelay = Math.min(_vcWsRetryDelay * 2, 30000);
    };
    _vcWs.onerror = () => _vcWs.close();
}

function _vcWsSend(obj) {
    if (_vcWs && _vcWs.readyState === WebSocket.OPEN) _vcWs.send(JSON.stringify(obj));
}

function _setDot(online) {
    const d = document.getElementById('vcCallDot');
    const t = document.getElementById('vcCallConnStatus');
    if (d) d.className = 'vc-conn-dot' + (online ? ' online' : '');
    if (t) t.textContent = online ? 'Live' : 'Connecting…';
}

/* ── Poll fallback ─────────────────────────────────────── */
function _startPoll() {
    clearInterval(_vcPollTimer);
    _vcPollTimer = setInterval(async () => {
        if (!document.getElementById('vccall')?.classList.contains('active')) return;
        try {
            const res  = await fetch(`${VC_API}/status`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
            const data = await res.json();
            const incoming = data.call || null;
            if (JSON.stringify(incoming) !== JSON.stringify(_vcCallState)) {
                _vcCallState = incoming;
                _vcSpeaking  = {};
                _renderCallUI();
            }
        } catch (_) {}
    }, 4000);
}

/* ── Message handler ───────────────────────────────────── */
function _handleMsg(msg) {
    switch (msg.type) {
        case 'call_state':
            _vcCallState = msg.data;
            _vcSpeaking  = {};
            _renderCallUI();
            break;
        case 'call_started':
            _vcCallState = msg.data;
            _vcSpeaking  = {};
            _renderCallUI();
            _showVcToast('Connected · ' + msg.data?.code);
            break;
        case 'call_ended':
            _vcCallState = null;
            _vcSpeaking  = {};
            _renderCallUI();
            _showVcToast('Call ended' + (msg.duration ? ' · ' + msg.duration : ''));
            break;
        case 'speaking':
            if (!_vcVisualizerOn) break;
            _vcSpeaking[msg.user_id] = msg.speaking;
            _applyRing(msg.user_id, msg.speaking);
            clearTimeout(_vcRingTimers[msg.user_id]);
            if (msg.speaking) {
                _vcRingTimers[msg.user_id] = setTimeout(() => {
                    _vcSpeaking[msg.user_id] = false;
                    _applyRing(msg.user_id, false);
                }, 400);
            }
            break;
        case 'error':
            _showVcToast(msg.message || 'Error', true);
            _setBtnLoading(false);
            break;
    }
}

/* ── Ring ──────────────────────────────────────────────── */
function _applyRing(userId, speaking) {
    const card = document.querySelector(`.vc-avatar-card[data-uid="${userId}"]`);
    if (!card) return;
    card.querySelector('.vc-ring')?.classList.toggle('speaking', speaking && _vcRingPulseOn);
    card.querySelectorAll('.vc-audio-bar').forEach(b => b.classList.toggle('active', speaking && _vcVisualizerOn));
}

/* ── Render ────────────────────────────────────────────── */
function _renderCallUI() {
    const wrap = document.getElementById('vcCallContent');
    if (!wrap) return;
    if (!_vcCallState) {
        wrap.innerHTML = _idleHTML();
        clearInterval(_vcElapsedTimer);
        return;
    }
    wrap.innerHTML = _activeHTML(_vcCallState);
    _startElapsed();
    Object.entries(_vcSpeaking).forEach(([uid, s]) => { if (s) _applyRing(uid, true); });
}

/* ── Idle HTML ─────────────────────────────────────────── */
function _idleHTML() {
    return `
    <div class="vc-idle-wrap">
        <div class="vc-idle-hero">
            <div class="vc-idle-icon"><i class="fa-solid fa-phone"></i></div>
            <h2 class="vc-idle-title">No Active Call</h2>
            <p class="vc-idle-sub">Start a random cross-server voice call or join one with a code. You must be in a Discord voice channel first.</p>
        </div>
        <div class="vc-action-cards">
            <div class="vc-action-card glass">
                <div class="vc-action-card-icon"><i class="fa-solid fa-shuffle"></i></div>
                <div class="vc-action-card-body">
                    <span class="vc-action-card-title">Random Call</span>
                    <span class="vc-action-card-desc">Match with a random server instantly</span>
                </div>
                <button class="vc-btn vc-btn-primary" id="vcCallBtn" onclick="vcStartCall()">
                    <i class="fa-solid fa-phone"></i> Call
                </button>
            </div>
            <div class="vc-action-card glass">
                <div class="vc-action-card-icon"><i class="fa-solid fa-key"></i></div>
                <div class="vc-action-card-body">
                    <span class="vc-action-card-title">Join by Code</span>
                    <span class="vc-action-card-desc">Enter a 6-character call code</span>
                </div>
                <div class="vc-join-row">
                    <input id="vcCodeInput" class="vc-code-input" type="text"
                           placeholder="A1B2C3" maxlength="6"
                           oninput="this.value=this.value.toUpperCase()"
                           onkeydown="if(event.key==='Enter')vcJoinCall()">
                    <button class="vc-btn vc-btn-primary" id="vcJoinBtn" onclick="vcJoinCall()">
                        <i class="fa-solid fa-arrow-right-to-bracket"></i> Join
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

/* ── Active HTML ───────────────────────────────────────── */
function _activeHTML(state) {
    const { code, side_a, side_b, start_ts } = state;
    const elapsed = start_ts ? _fmt(Math.floor(Date.now() / 1000 - start_ts)) : '—';
    return `
    <div class="vc-active-wrap">
        <div class="vc-active-header glass">
            <div class="vc-active-header-left">
                <span class="vc-live-dot"></span>
                <span class="vc-active-code">Code <kbd>${code}</kbd></span>
                <span class="vc-active-elapsed" id="vcElapsed">${elapsed}</span>
            </div>
            <button class="vc-btn vc-btn-danger" id="vcHangupBtn" onclick="vcHangup()">
                <i class="fa-solid fa-phone-slash"></i> Hang Up
            </button>
        </div>
        <div class="vc-sides-grid">
            ${_sideHTML(side_a, 'A')}
            <div class="vc-sides-divider">
                <div class="vc-sides-divider-line"></div>
                <span class="vc-sides-divider-icon"><i class="fa-solid fa-right-left"></i></span>
                <div class="vc-sides-divider-line"></div>
            </div>
            ${_sideHTML(side_b, 'B')}
        </div>
    </div>`;
}

function _sideHTML(side, label) {
    if (!side) return `
        <div class="vc-side vc-side-empty glass">
            <span class="vc-side-waiting"><i class="fa-solid fa-hourglass-half"></i> Waiting for side ${label}…</span>
        </div>`;
    const members = side.members || [];
    const avatars = members.length
        ? members.map(_avatarHTML).join('')
        : `<div class="vc-no-members"><i class="fa-solid fa-microphone-slash"></i> Empty</div>`;
    return `
    <div class="vc-side glass">
        <div class="vc-side-header">
            <img class="vc-side-guild-icon" src="${_guildIcon(side.guild_id, side.guild_icon)}"
                 onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
            <div class="vc-side-info">
                <span class="vc-side-guild-name">${_esc(side.guild_name)}</span>
                <span class="vc-side-vc-name"><i class="fa-solid fa-volume-high"></i> ${_esc(side.vc_name)}</span>
            </div>
        </div>
        <div class="vc-avatars-grid">${avatars}</div>
    </div>`;
}

function _avatarHTML(m) {
    const av = m.avatar
        ? `https://cdn.discordapp.com/avatars/${m.id}/${m.avatar}.${m.avatar.startsWith('a_') ? 'gif' : 'webp'}?size=80`
        : `https://cdn.discordapp.com/embed/avatars/${Number(m.id) % 5}.png`;
    return `
    <div class="vc-avatar-card" data-uid="${m.id}">
        <div class="vc-avatar-wrap">
            <div class="vc-ring"></div>
            <img class="vc-avatar-img" src="${av}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
        </div>
        <div class="vc-audio-bars">
            <div class="vc-audio-bar"></div>
            <div class="vc-audio-bar"></div>
            <div class="vc-audio-bar"></div>
        </div>
        <span class="vc-avatar-name">${_esc(m.display_name || m.username)}</span>
    </div>`;
}

/* ── Elapsed timer ─────────────────────────────────────── */
function _startElapsed() {
    clearInterval(_vcElapsedTimer);
    if (!_vcCallState?.start_ts) return;
    _vcElapsedTimer = setInterval(() => {
        const el = document.getElementById('vcElapsed');
        if (!el) { clearInterval(_vcElapsedTimer); return; }
        el.textContent = _fmt(Math.floor(Date.now() / 1000 - _vcCallState.start_ts));
    }, 1000);
}

/* ── API actions ───────────────────────────────────────── */
window.vcStartCall = async function () {
    if (!_assertAuth()) return;
    if (!_vcGuildId) { _showVcToast('Select a server first', true); return; }
    _setBtnLoading(true, 'vcCallBtn');
    try {
        const r = await fetch(`${VC_API}/call`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ user_id: userProfile.id, guild_id: _vcGuildId })
        });
        const d = await r.json();
        if (d.error) { _showVcToast(d.error, true); _setBtnLoading(false, 'vcCallBtn'); }
    } catch (_) {
        _showVcToast('Request failed', true);
        _setBtnLoading(false, 'vcCallBtn');
    }
};

window.vcJoinCall = async function () {
    if (!_assertAuth()) return;
    if (!_vcGuildId) { _showVcToast('Select a server first', true); return; }
    const code = (document.getElementById('vcCodeInput')?.value || '').trim().toUpperCase();
    if (code.length !== 6) { _showVcToast('Enter a 6-character code', true); return; }
    _setBtnLoading(true, 'vcJoinBtn');
    try {
        const r = await fetch(`${VC_API}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ user_id: userProfile.id, guild_id: _vcGuildId, code })
        });
        const d = await r.json();
        if (d.error) { _showVcToast(d.error, true); _setBtnLoading(false, 'vcJoinBtn'); }
    } catch (_) {
        _showVcToast('Request failed', true);
        _setBtnLoading(false, 'vcJoinBtn');
    }
};

window.vcHangup = async function () {
    if (!_assertAuth()) return;
    const guildId = _vcCallState?.side_a?.guild_id
        || _vcCallState?.side_b?.guild_id
        || _vcGuildId;
    if (!guildId) { _showVcToast('No active call found', true); return; }
    _setBtnLoading(true, 'vcHangupBtn');
    try {
        const r = await fetch(`${VC_API}/hangup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ user_id: userProfile.id, guild_id: guildId })
        });
        const d = await r.json();
        if (d.error) { _showVcToast(d.error, true); _setBtnLoading(false, 'vcHangupBtn'); }
    } catch (_) {
        _showVcToast('Request failed', true);
        _setBtnLoading(false, 'vcHangupBtn');
    }
};

/* ── Settings hooks ────────────────────────────────────── */
window.applyVcPrefVisualizer = function (on) {
    _vcVisualizerOn = on;
    if (!on) {
        document.querySelectorAll('.vc-ring').forEach(r => r.classList.remove('speaking'));
        document.querySelectorAll('.vc-audio-bar').forEach(b => b.classList.remove('active'));
    }
};

window.applyVcPrefRingPulse = function (on) {
    _vcRingPulseOn = on;
    if (!on) document.querySelectorAll('.vc-ring').forEach(r => r.classList.remove('speaking'));
};

/* ── Guild dropdown — bot-mutual servers via /api/vc/guilds */
window.toggleVcGuildDropdown = function () {
    const menu = document.getElementById('vcGuildDropdownMenu');
    if (!menu) return;
    const wasHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    if (wasHidden && !menu.dataset.loaded) _loadVcGuilds();
    if (wasHidden) {
        document.addEventListener('click', function _close(e) {
            const wrap = document.getElementById('vcGuildDropdown');
            if (wrap && !wrap.contains(e.target)) {
                menu.classList.add('hidden');
                document.removeEventListener('click', _close);
            }
        });
    }
};

async function _loadVcGuilds() {
    const menu = document.getElementById('vcGuildDropdownMenu');
    if (!menu) return;
    menu.innerHTML = '<div style="padding:10px 14px;color:var(--text-muted);font-size:13px">Loading…</div>';

    const token = localStorage.getItem('d_token');
    if (!token) {
        menu.innerHTML = '<div style="padding:10px 14px;color:var(--text-muted);font-size:13px">Not logged in</div>';
        return;
    }

    try {
        // Fetch user's guilds + bot's guilds in parallel
        const [userRes, botRes] = await Promise.all([
            fetch('https://discord.com/api/users/@me/guilds', {
                headers: { Authorization: `Bearer ${token}` }
            }),
            fetch(`${VC_API}/guilds`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
        ]);

        const userGuilds = await userRes.json();
        const botData    = await botRes.json();

        if (!Array.isArray(userGuilds)) {
            menu.innerHTML = '<div style="padding:10px 14px;color:var(--text-muted);font-size:13px">Failed to load servers</div>';
            return;
        }

        const botGuildIds = new Set((botData.guilds || []).map(g => g.id));

        // Only show guilds the user is in AND the bot is in
        const mutual = userGuilds.filter(g => botGuildIds.has(g.id));

        if (!mutual.length) {
            menu.innerHTML = '<div style="padding:10px 14px;color:var(--text-muted);font-size:13px">No mutual servers found</div>';
            return;
        }

        menu.innerHTML = '';
        menu.dataset.loaded = '1';

        mutual.forEach(g => {
            const icon = g.icon
                ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
                : null;

            const item = document.createElement('div');
            item.className = 'guild-dropdown-item';
            item.innerHTML = icon
                ? `<img src="${icon}" alt="${_esc(g.name)}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;flex-shrink:0">`
                : `<div class="guild-initial" style="width:22px;height:22px;font-size:11px;flex-shrink:0">${g.name.charAt(0).toUpperCase()}</div>`;
            item.innerHTML += `<span class="guild-dropdown-name" style="font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${_esc(g.name)}</span>`;

            item.onclick = () => {
                _vcGuildId = g.id;
                const txt = document.getElementById('vcGuildDropdownText');
                if (txt) txt.textContent = g.name;
                const sel = document.getElementById('vcGuildDropdownSelected');
                if (sel) {
                    let img = sel.querySelector('img.vc-guild-sel-img');
                    if (!img) {
                        img = document.createElement('img');
                        img.className = 'vc-guild-sel-img';
                        img.style.cssText = 'width:20px;height:20px;border-radius:50%;margin-right:8px;vertical-align:middle;flex-shrink:0';
                        sel.prepend(img);
                    }
                    img.src = icon || '';
                    img.style.display = icon ? '' : 'none';
                }
                menu.classList.add('hidden');
            };

            menu.appendChild(item);
        });
    } catch (_) {
        menu.innerHTML = '<div style="padding:10px 14px;color:var(--text-muted);font-size:13px">Failed to load servers</div>';
    }
}

/* ── Helpers ───────────────────────────────────────────── */
function _assertAuth() {
    if (!userProfile?.id) { _showVcToast('Log in first', true); return false; }
    return true;
}

function _setBtnLoading(loading, id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.disabled      = loading;
    el.style.opacity = loading ? '0.5' : '';
}

function _fmt(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${m}:${String(s).padStart(2,'0')}`;
}

function _guildIcon(id, hash) {
    if (!hash) return 'https://cdn.discordapp.com/embed/avatars/0.png';
    return `https://cdn.discordapp.com/icons/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'webp'}?size=64`;
}

function _esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let _vcToastTimer = null;
function _showVcToast(msg, isError = false) {
    let t = document.getElementById('vcToast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'vcToast';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className   = 'vc-toast' + (isError ? ' vc-toast-error' : '');
    t.classList.add('show');
    clearTimeout(_vcToastTimer);
    _vcToastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

window._vcCallTabLeave = function () {
    clearInterval(_vcElapsedTimer);
    clearInterval(_vcPollTimer);
};