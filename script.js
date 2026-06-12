const images = {
  modern: 'background-img/Modern%20Client.png',
  tuff:   'background-img/Tuff%20Client.png',
  eb:     'background-img/EB%20Client.png',
  resent: 'background-img/Resent%20Client.png',
  death:  'background-img/Death%20Client.png',
  aero:   'background-img/Aero%20Client.png'
};

const games = {
  modern: {
    icon:'🌿', iconBg:'linear-gradient(135deg,#7cbf3f,#3a6e10)',
    version:'WASM Build', accent:'#7cbf3f', url:'https://itzpulsev2.github.io/modernclient',
  },
  tuff: {
    icon:'💎', iconBg:'linear-gradient(135deg,#5b9bd5,#1a5a9c)',
    version:'WASM Build', accent:'#5b9bd5', url:'https://itzpulsev2.github.io/Tuffclient',
  },
  eb: {
    icon:'⚔️', iconBg:'linear-gradient(135deg,#d45a5a,#7a1515)',
    version:'WASM Build', accent:'#d45a5a', url:'https://itzpulsev2.github.io/ebclient',
  },
  resent: {
    icon:'🛡️', iconBg:'linear-gradient(135deg,#d4a020,#7a5a00)',
    version:'1.8.9', accent:'#d4a020', url:'https://itzpulsev2.github.io/ResentClient',
  },
  death: {
    icon:'💀', iconBg:'linear-gradient(135deg,#c05ad4,#5a1a7a)',
    version:'WASM Build', accent:'#c05ad4', url:'https://itzpulsev2.github.io/DeathClient',
  },
  aero: {
    icon:'🌀', iconBg:'linear-gradient(135deg,#00c8ff,#0050a0)',
    version:'WASM Build', accent:'#00c8ff', url:'https://itzpulsev2.github.io/AeroClient',
  }
};

let currentGame = 'modern';
let currentVersion = 'wasm';
let currentTuffVer = '1_1UT15';
let currentAeroVer = '1.0.7';
let currentDeathVer = '1.12';
let currentDeathBuild = 'wasm';

// Music
let musicFiles = [];
let musicIndex = 0;
let musicOn = false;
const audioEl = new Audio();
audioEl.volume = 0.4;

async function loadPlaylist() {
  try {
    const res = await fetch('music/playlist.json');
    if (!res.ok) throw new Error('not found');
    const data = await res.json();
    musicFiles = data.map(f => 'music/' + f);
  } catch(e) {
    console.warn('Could not load music/playlist.json:', e);
    musicFiles = [];
  }
}

function resetVersionDropdown() {
  // Restore default JS/WASM options (used by modern, tuff, aero)
  const dd = document.getElementById('versionDropdown');
  if (!dd) return;
  dd.innerHTML = `
    <div class="ver-option" id="opt-js" onclick="selectVersion('js', event)">
      <span style="font-size:14px;">☕</span>
      <div>
        <div style="font-size:13px;font-weight:700;" id="opt-js-label">Javascript Build</div>
        <div style="font-size:11px;color:#888;">Recommended · Wider compatibility</div>
      </div>
    </div>
    <div class="ver-option" id="opt-wasm" onclick="selectVersion('wasm', event)">
      <span style="font-size:14px;">⚡</span>
      <div>
        <div style="font-size:13px;font-weight:700;" id="opt-wasm-label">WASM Build ✓</div>
        <div style="font-size:11px;color:#888;">Faster · WebAssembly powered</div>
      </div>
    </div>
  `;
}

function closeAllDropdowns() {
  const dropdowns = ['versionDropdown','tuffVerDropdown','aeroVerDropdown'];
  const arrows = ['versionArrow','tuffVerArrow','aeroVerArrow'];
  dropdowns.forEach(id => {
    const dd = document.getElementById(id);
    if (dd) dd.style.display = 'none';
  });
  arrows.forEach(id => {
    const a = document.getElementById(id);
    if (a) a.textContent = '▾';
  });
}

function selectGame(gameKey, el) {
  closeAllDropdowns();
  if (gameKey !== 'death') resetVersionDropdown();
  currentGame = gameKey;
  // Switch back to Play tab
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.remove('active');
    if (t.textContent.trim() === 'Play') t.classList.add('active');
  });
  document.querySelectorAll('.tab-panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
  const playPanel = document.getElementById('tab-play');
  if (playPanel) { playPanel.classList.add('active'); playPanel.style.display = 'flex'; playPanel.style.flexDirection = 'column'; }
  document.querySelectorAll('.game-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  const g = games[gameKey];
  const heroBg = document.getElementById('heroBg');
  heroBg.style.backgroundImage = 'url("' + images[gameKey] + '")';
  heroBg.classList.remove('entering');
  void heroBg.offsetWidth;
  heroBg.classList.add('entering');
  const playBtn = document.getElementById('playBtn');
  playBtn.href = g.url;
  playBtn.style.background = g.accent;
  playBtn.style.boxShadow = '0 4px 20px ' + g.accent + '66';
  const iconEl = document.getElementById('versionIcon');
  const iconMap = {
    modern: 'icons/Grass_Block.ico',
    tuff:   'icons/Dirt_Block.ico',
    eb:     'icons/Short_Sword.ico',
    resent: 'icons/Creeper_Face.ico',
    death:  'icons/Hacker_Face.ico',
    aero:   'icons/Mace.ico'
  };
  if (iconMap[gameKey]) {
    iconEl.innerHTML = '<img src="' + iconMap[gameKey] + '" style="width:100%;height:100%;object-fit:contain;" onerror="this.textContent=g.icon">';
  } else {
    iconEl.textContent = g.icon;
  }
  document.getElementById('versionNum').textContent = gameKey === 'modern' ? (currentVersion === 'wasm' ? 'WASM Build' : 'Javascript Build') : g.version;
  document.getElementById('versionLabel').textContent = gameKey === 'modern' ? 'Modern Client' : 'Latest release';
  // hide dropdown arrow for non-modern clients
  const arrow = document.getElementById('versionArrow');
  if (arrow) arrow.style.display = (gameKey === 'modern' || gameKey === 'tuff' || gameKey === 'death' || gameKey === 'aero') ? 'block' : 'none';
  // show/hide tuff version selector
  const tuffSel = document.getElementById('tuffVerSelector');
  if (tuffSel) tuffSel.style.display = (gameKey === 'tuff') ? 'flex' : 'none';
  if (gameKey === 'tuff') updateTuffPlayUrl();
  // update play URL for modern client
  const clientUrls = {
    modern: { js: 'https://itzpulsev2.github.io/modernclient/js/', wasm: 'https://itzpulsev2.github.io/modernclient/wasm/' },
    tuff:   { js: 'https://itzpulsev2.github.io/Tuffclient/files/1_1UT15/JS/', wasm: 'https://itzpulsev2.github.io/Tuffclient/files/1_1UT15/WASM/' }
  };
  if (clientUrls[gameKey]) {
    document.getElementById('playBtn').href = clientUrls[gameKey][currentVersion];
    document.getElementById('opt-js-label').textContent = 'Javascript Build';
    document.getElementById('opt-wasm-label').textContent = 'WASM Build ✓';
  }
  if (gameKey === 'death') {
    currentDeathVer = '1.12'; currentDeathBuild = 'wasm';
    document.getElementById('versionNum').textContent = '1.12.2 — WASM';
    document.getElementById('versionLabel').textContent = 'Death Client';
    document.getElementById('playBtn').href = 'https://itzpulsev2.github.io/DeathClient/client/versions/1.12/1.4.2/index.html';
  }
  if (gameKey === 'aero') {
    document.getElementById('versionNum').textContent = 'WASM Build';
    document.getElementById('versionLabel').textContent = 'Aero Client';
    document.getElementById('opt-js-label').textContent = 'Javascript Build';
    document.getElementById('opt-wasm-label').textContent = 'WASM Build ✓';
    updateAeroPlayUrl();
  }
  // show/hide aero version selector
  const aeroSel = document.getElementById('aeroVerSelector');
  if (aeroSel) aeroSel.style.display = (gameKey === 'aero') ? 'flex' : 'none';
  renderNews(gameKey);
  renderInstalls(gameKey);
  renderPatches(gameKey);
  renderDesc(gameKey);
  const tagEl = document.getElementById('clientDescTag');
  const names = {modern:'Modern Client',tuff:'Tuff Client',eb:'EB Client',resent:'Resent Client',death:'Death Client',aero:'Aero Client'};
  if (tagEl) tagEl.textContent = '✦ ABOUT ' + (names[gameKey] || gameKey).toUpperCase();
}

function switchTab(tabName, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
  const panel = document.getElementById('tab-' + tabName);
  if (panel) { panel.classList.add('active'); panel.style.display = 'flex'; panel.style.flexDirection = 'column'; }
}

function renderNews(gameKey) {
  const g = games[gameKey];

    if (!g || !g.news) {
    console.warn("No news data for:", gameKey);
    return;
  }

  document.getElementById('newsCards').innerHTML = g.news.map(n =>
    '<div class="news-card" onclick="window.open(\'https://eaglercraft.com\',\'_blank\')">' +
    '<div class="news-card-img" style="background:' + n.bg + '">' + n.emoji + '</div>' +
    '<div class="news-card-body"><div class="news-card-title">' + n.title + '</div>' +
    '<div class="news-card-date">' + n.date + '</div></div></div>'
  ).join('');
}

function renderInstalls(gameKey) {
  const g = games[gameKey];
  document.getElementById('installList').innerHTML = g.installs.map(i =>
    '<div class="install-card"><div class="install-card-icon">' + i.emoji + '</div>' +
    '<div class="install-card-info"><div class="install-card-name">' + i.name + '</div>' +
    '<div class="install-card-ver">Version ' + i.ver + '</div></div>' +
    '<div class="install-card-actions">' +
    '<button class="ic-btn" onclick="event.stopPropagation();alert(\'Launching ' + i.name + '...\')">▶ Launch</button>' +
    '<button class="ic-btn" onclick="event.stopPropagation();">✏️ Edit</button>' +
    '<button class="ic-btn" onclick="event.stopPropagation();if(confirm(\'Delete?\'))this.closest(\'.install-card\').remove()">🗑️</button>' +
    '</div></div>'
  ).join('');
}

function renderPatches(gameKey) {
  const g = games[gameKey];
  document.getElementById('patchList').innerHTML = g.patches.map(p =>
    '<div style="background:#222;border:1px solid #2a2a2a;border-radius:8px;padding:16px;margin-bottom:12px;">' +
    '<div style="font-size:16px;font-weight:700;margin-bottom:4px;">Version ' + p.ver +
    ' <span style="font-size:12px;color:#666;font-weight:400;margin-left:8px;">' + p.date + '</span></div>' +
    '<div style="font-size:13px;color:#aaa;line-height:1.6;">' + p.notes + '</div></div>'
  ).join('');
}

// Init — set Modern Client image immediately
const heroBg = document.getElementById('heroBg');
heroBg.style.backgroundImage = 'url("background-img/Modern%20Client.png")';
document.getElementById('tab-play').style.display = 'flex';
document.getElementById('tab-play').style.flexDirection = 'column';

function renderDesc(gameKey) {
  const descs = {
    modern: {
      desc: `The Eaglercraft <strong>Modern Client</strong> is a custom, modified client for Eaglercraft — the browser-based version of Minecraft Java Edition. Similar to traditional PvP clients like Lunar or Badlion, it is designed to enhance gameplay by adding useful user interface overlays, performance boosts, and quality-of-life features.<br><br>Because Eaglercraft operates through a browser, these custom clients alter or add visual and mechanical features on top of the base game.`,
      features: [
        ["📊","HUD Overlays","Displays your active FPS, Armor Status, and Clicks Per Second (CPS)"],
        ["✨","Quality of Life","Toggle Sprint, customizable Dynamic FOV, block overlays, disable rain or scoreboards"],
        ["⚔️","PvP Tools","Free Look, hit-box visualizers, and other combat-oriented optimizations"],
        ["🎨","Built-in UI","A custom, visually distinct main menu and settings system different from vanilla Eaglercraft GUI"]
      ]
    },
    tuff: {
      desc: `The <strong>Tuff Client</strong> is a popular, feature-rich, and heavily modified Eaglercraft client that runs on the <strong>1.12.2 base</strong>. It is widely regarded in the browser-Minecraft community for its advanced modifications and modern server compatibility.<br><br>Unlike most clients, Tuff supports <strong>ViaVersion</strong> — meaning you can join 1.21+ servers and interact with modern blocks, entities and items despite running an older base version.`,
      features: [
        ["🌐","ViaVersion","Play on modern 1.21+ servers from a 1.12.2 base client"],
        ["⛏️","Below Y-0 & Shields","Dig below Y-level 0 and use modern shield combat mechanics"],
        ["✨","QoL Mods","Fullbright, Minimaps, TNT timers, Toggle Sprint, custom crosshairs"],
        ["🔑","Auto-Login","Automatically logs you into supported servers — no manual codes needed"],
        ["📊","HUD Config","Keystrokes, CPS, FPS displays and small in-hand item option"],
        ["👥","Client Brand","See what Eaglercraft client other lobby players are using"]
      ]
    },
    eb: {
      desc: `The <strong>EB Client</strong> is a combat-focused, feature-rich Eaglercraft client running on the <strong>1.12.2 base</strong> with ViaVersion support for newer servers. It is built specifically for competitive PvP players who want every possible edge in fights.<br><br>EB Client includes a wide range of combat modules alongside essential quality-of-life tools, making it a strong all-around choice for serious players.`,
      features: [
        ["⚔️","Combat Modules","KillAura, Triggerbot, RapidFire, Velocity and more"],
        ["🎯","Render Tools","PlayerESP, BlockESP, HoleESP, Wallhack and ArrayLists"],
        ["🏃","Movement Mods","AntiAFly, Blink, Dolphin, Fly, Sprint, Step and VanillaFly"],
        ["📊","HUD Overlays","FPS, CPS, keystrokes, armor display and custom crosshair"],
        ["🌐","ViaVersion","Join 1.21+ servers while running the 1.12.2 base"],
        ["🎨","GUI Colors","Customisable client accent colour from a built-in colour picker"]
      ]
    },
    resent: {
      desc: `The <strong>Resent Client</strong> is one of the most popular modified clients for Eaglercraft, acting as an optimization and PvP modification suite for the browser-based Minecraft 1.5.2 and 1.8.9 experience.<br><br>Resent is praised for its wide customisation options, built-in texture pack library, and a movable HUD system that lets you arrange your screen exactly how you want it.`,
      features: [
        ["🎨","60+ Texture Packs","Comes pre-packaged with over 60 different built-in texture packs"],
        ["🖱️","Movable HUD","Drag and drop UI elements like armor, potions and status anywhere on screen"],
        ["📊","Custom Overlays","Keystrokes, FPS/CPS counters, custom crosshairs and Fullbright mode"],
        ["🏆","PvP Suite","Advanced PvP modules for competitive Eaglercraft servers"],
        ["🔧","Customization","Wide variety of toggleable features and layout options"],
        ["💡","Open Source","Community-driven development on GitHub"]
      ]
    },
    death: {
      desc: `An Eaglercraft <strong>Death Client</strong> refers to a heavily modified, often hacked client built on top of Eaglercraft. It includes an extensive built-in cheat and module system covering combat, movement, rendering and world exploitation.<br><br>Death Client provides one of the most feature-packed experiences available — giving players complete control over nearly every aspect of the game with deep per-module configuration.`,
      features: [
        ["💀","Combat Mods","KillAura, ClickAimbot, Crits, RapidFire, Triggerbot, Velocity"],
        ["🌍","World Tools","Fullbright, NoFall, SignCrashExploit, NukeWorld"],
        ["🏃","Movement","AntiAFly, Blink, Dolphin, Elytra, Fly, Sprint, Step"],
        ["🎨","GUI Colors","Blue, Red, Yellow, Green, Purple, Cyan, Orange, Turquoise"],
        ["📋","ArrayList","On-screen display of all active modules"],
        ["⚙️","Deep Settings","Per-module sliders for Range, Speed, Delay, and more"]
      ]
    },
    aero: {
      desc: `The <strong>Aero Client</strong> is a custom, community-made performance and PvP modpack built for Eaglercraft — the open-source version of Minecraft that runs directly in web browsers. Like Lunar or Badlion for desktop, Aero is designed to make the browser-based experience feel like a premium client.<br><br>Aero is especially popular on low-end hardware like Chromebooks where raw FPS performance matters most.`,
      features: [
        ["🚀","FPS Optimization","Tweaks and resource configs tailored for maximum frame rate on low-end hardware"],
        ["📊","PvP HUD","Keystroke trackers, CPS counters, armor status, customizable scoreboards"],
        ["🎨","Visual Customization","Custom texture packs, UI colour tweaks, FOV adjustments and crosshair options"],
        ["⚡","Low Latency","Minimal input delay and optimised click response"],
        ["☁️","No Install","Runs fully in-browser — no downloads or installs needed"],
        ["🔧","Lightweight","Minimal memory footprint for smooth performance on any device"]
      ]
    }
  };

  const d = descs[gameKey];
  if (!d) return;
  const descEl = document.getElementById("clientDescText");
  const featEl = document.getElementById("clientFeatures");
  if (descEl) descEl.innerHTML = d.desc;
  if (featEl) featEl.innerHTML = "<div class=\"client-feature-title\">⚙️ Key Features</div><div class=\"client-feature-grid\">" +
    d.features.map(f => "<div class=\"cf-item\"><span class=\"cf-icon\">" + f[0] + "</span><div><div class=\"cf-name\">" + f[1] + "</div><div class=\"cf-desc\">" + f[2] + "</div></div></div>").join("") +
    "</div>";
}

renderDesc('modern');

// Auto-start music on page load
async function autoStartMusic() {
  if (musicOn) return;
  if (musicFiles.length === 0) await loadPlaylist();
  if (musicFiles.length === 0) return;
  musicOn = true;
  setToggleState(true);
  audioEl.src = musicFiles[0];
  const p = audioEl.play();
  if (p !== undefined) {
    p.then(() => {
      document.getElementById('nowPlayingText').textContent = '🎵 ' + musicFiles[0].replace('music/','').replace('.mp3','');
      document.getElementById('nowPlayingRow').style.display = 'flex';
      audioEl.onended = () => { if (musicOn) playTrack(musicIndex + 1); };
      document.removeEventListener('click', onFirstInteraction, true);
      document.removeEventListener('keydown', onFirstInteraction);
    }).catch(() => {
      musicOn = false;
      setToggleState(false);
      audioEl.src = '';
    });
  }
}

function onFirstInteraction() {
  if (!musicOn) autoStartMusic();
  document.removeEventListener('click', onFirstInteraction, true);
  document.removeEventListener('keydown', onFirstInteraction);
}

window.addEventListener('load', autoStartMusic);
document.addEventListener('click', onFirstInteraction, true);
document.addEventListener('keydown', onFirstInteraction);

// --- Aero version selector ---
function updateAeroPlayUrl() {
  const build = currentVersion === 'wasm' ? 'wasm' : 'js';
  document.getElementById('playBtn').href = 'https://itzpulsev2.github.io/AeroClient/' + currentAeroVer + '/' + build + '.html';
}

function buildAeroVerDropdown() {
  const dd = document.getElementById('aeroVerDropdown');
  if (!dd) return;
  const versions = ['1.0.5', '1.0.6', '1.0.7'];
  dd.innerHTML = versions.map(v =>
    '<div class="ver-option' + (v === currentAeroVer ? ' active' : '') + '" onclick="selectAeroVer(\'' + v + '\', event)" style="padding:8px 14px;">' +
    '<div style="font-size:13px;font-weight:700;">' + v + (v === currentAeroVer ? ' ✓' : '') + '</div>' +
    '</div>'
  ).join('');
}

function toggleAeroVerDropdown() {
  const dd = document.getElementById('aeroVerDropdown');
  const arrow = document.getElementById('aeroVerArrow');
  if (!dd) return;
  buildAeroVerDropdown();
  const open = dd.style.display === 'block';
  dd.style.display = open ? 'none' : 'block';
  arrow.textContent = open ? '▾' : '▴';
}

function selectAeroVer(ver, event) {
  event.stopPropagation();
  currentAeroVer = ver;
  document.getElementById('aeroVerNum').textContent = ver;
  updateAeroPlayUrl();
  document.getElementById('aeroVerDropdown').style.display = 'none';
  document.getElementById('aeroVerArrow').textContent = '▾';
  buildAeroVerDropdown();
}

// Close aero dropdown when clicking outside



function selectDeathConfig(ver, build, event) {
  event.stopPropagation();
  currentDeathVer = ver;
  currentDeathBuild = build;
  const numEl = document.getElementById('versionNum');
  const labelEl = document.getElementById('versionLabel');
  const playBtn = document.getElementById('playBtn');
  const dd = document.getElementById('versionDropdown');
  const arrow = document.getElementById('versionArrow');

  let url, label;
  if (ver === '1.12') {
    url = 'https://itzpulsev2.github.io/DeathClient/client/versions/1.12/1.4.2/index.html';
    label = '1.12.2';
    numEl.textContent = '1.12.2 — WASM';
  } else if (ver === '1.8' && build === 'wasm') {
    url = 'https://itzpulsev2.github.io/DeathClient/client/versions/1.8/1.4.2/wasm/index.html';
    numEl.textContent = '1.8 — WASM';
  } else {
    url = 'https://itzpulsev2.github.io/DeathClient/client/versions/1.8/1.4.2/js/index.html';
    numEl.textContent = '1.8 — Javascript';
  }
  labelEl.textContent = 'Death Client';
  playBtn.href = url;
  dd.style.display = 'none';
  arrow.textContent = '▾';
}


// --- Tuff version number selector ---

function buildTuffVerDropdown() {
  const dd = document.getElementById('tuffVerDropdown');
  if (!dd) return;
  const versions = ['1_1UT5','1_1UT6','1_1UT7','1_1UT8','1_1UT9','1_1UT10','1_1UT11','1_1UT12','1_1UT13','1_1UT14','1_1UT15'];
  dd.innerHTML = versions.map(v =>
    '<div class="ver-option' + (v === currentTuffVer ? ' active' : '') + '" onclick="selectTuffVer(\''+v+'\', event)" style="padding:8px 14px;">' +
    '<div style="font-size:13px;font-weight:700;">' + v + (v === currentTuffVer ? ' ✓' : '') + '</div>' +
    '</div>'
  ).join('');
}

function toggleTuffVerDropdown() {
  const dd = document.getElementById('tuffVerDropdown');
  const arrow = document.getElementById('tuffVerArrow');
  if (!dd) return;
  buildTuffVerDropdown();
  // For death client, populate with MC version + build options
  if (currentGame === 'death') {
    dd.innerHTML = `
      <div style="padding:6px 10px;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;">Minecraft Version</div>
      <div class="ver-option" id="death-112" onclick="selectDeathConfig('1.12','wasm',event)">
        <span style="font-size:14px;">🟣</span>
        <div>
          <div style="font-size:13px;font-weight:700;" id="death-112-label">1.12.2${currentDeathVer==='1.12'?' ✓':''}</div>
          <div style="font-size:11px;color:#888;">JS only</div>
        </div>
      </div>
      <div style="padding:6px 10px;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;border-top:1px solid #2a2a2a;">1.8 Build</div>
      <div class="ver-option" id="death-18-wasm" onclick="selectDeathConfig('1.8','wasm',event)">
        <span style="font-size:14px;">⚡</span>
        <div>
          <div style="font-size:13px;font-weight:700;">1.8 — WASM${currentDeathVer==='1.8'&&currentDeathBuild==='wasm'?' ✓':''}</div>
          <div style="font-size:11px;color:#888;">Faster · WebAssembly powered</div>
        </div>
      </div>
      <div class="ver-option" id="death-18-js" onclick="selectDeathConfig('1.8','js',event)">
        <span style="font-size:14px;">☕</span>
        <div>
          <div style="font-size:13px;font-weight:700;">1.8 — Javascript${currentDeathVer==='1.8'&&currentDeathBuild==='js'?' ✓':''}</div>
          <div style="font-size:11px;color:#888;">Wider compatibility</div>
        </div>
      </div>
    `;
  }
  const open = dd.style.display === 'block';
  dd.style.display = open ? 'none' : 'block';
  arrow.textContent = open ? '▾' : '▴';
}

function selectTuffVer(ver, event) {
  event.stopPropagation();
  currentTuffVer = ver;
  document.getElementById('tuffVerNum').textContent = ver;
  // Update play button URL
  updateTuffPlayUrl();
  // Close dropdown
  document.getElementById('tuffVerDropdown').style.display = 'none';
  document.getElementById('tuffVerArrow').textContent = '▾';
  buildTuffVerDropdown();
}

function updateTuffPlayUrl() {
  const build = currentVersion === 'wasm' ? 'WASM' : 'JS';
  document.getElementById('playBtn').href = 'https://itzpulsev2.github.io/Tuffclient/files/' + currentTuffVer + '/' + build + '/';
}

// Close tuff dropdown when clicking outside


// Set default WASM build display
document.getElementById('versionNum').textContent = 'WASM Build';
document.getElementById('versionLabel').textContent = 'Modern Client';
document.getElementById('playBtn').href = 'https://itzpulsev2.github.io/modernclient/wasm/';
// Mark WASM as active in dropdown
document.querySelectorAll('.ver-option').forEach(o => {
  if (o.querySelector('div div:first-child') && o.querySelector('div div:first-child').textContent.includes('WASM')) o.classList.add('active');
});


function toggleVersionDropdown() {
  const dd = document.getElementById('versionDropdown');
  const arrow = document.getElementById('versionArrow');
  if (!dd) return;
  // Only show dropdown for modern, tuff, death and aero
  if (currentGame !== 'modern' && currentGame !== 'tuff' && currentGame !== 'death' && currentGame !== 'aero') return;
  // For death client, populate with MC version + build options
  if (currentGame === 'death') {
    dd.innerHTML = `
      <div style="padding:6px 10px;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;">Minecraft Version</div>
      <div class="ver-option" id="death-112" onclick="selectDeathConfig('1.12','wasm',event)">
        <span style="font-size:14px;">🟣</span>
        <div>
          <div style="font-size:13px;font-weight:700;" id="death-112-label">1.12.2${currentDeathVer==='1.12'?' ✓':''}</div>
          <div style="font-size:11px;color:#888;">JS only</div>
        </div>
      </div>
      <div style="padding:6px 10px;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #2a2a2a;border-top:1px solid #2a2a2a;">1.8 Build</div>
      <div class="ver-option" id="death-18-wasm" onclick="selectDeathConfig('1.8','wasm',event)">
        <span style="font-size:14px;">⚡</span>
        <div>
          <div style="font-size:13px;font-weight:700;">1.8 — WASM${currentDeathVer==='1.8'&&currentDeathBuild==='wasm'?' ✓':''}</div>
          <div style="font-size:11px;color:#888;">Faster · WebAssembly powered</div>
        </div>
      </div>
      <div class="ver-option" id="death-18-js" onclick="selectDeathConfig('1.8','js',event)">
        <span style="font-size:14px;">☕</span>
        <div>
          <div style="font-size:13px;font-weight:700;">1.8 — Javascript${currentDeathVer==='1.8'&&currentDeathBuild==='js'?' ✓':''}</div>
          <div style="font-size:11px;color:#888;">Wider compatibility</div>
        </div>
      </div>
    `;
  }
  const open = dd.style.display === 'block';
  dd.style.display = open ? 'none' : 'block';
  arrow.textContent = open ? '▾' : '▴';
}

function selectVersion(ver, event) {
  event.stopPropagation();
  currentVersion = ver;
  const dd = document.getElementById('versionDropdown');
  const arrow = document.getElementById('versionArrow');
  const numEl = document.getElementById('versionNum');
  const labelEl = document.getElementById('versionLabel');
  const playBtn = document.getElementById('playBtn');

  // Update all option styles
  document.querySelectorAll('.ver-option').forEach(o => o.classList.remove('active'));
  event.currentTarget.classList.add('active');

  const buildUrls = {
    modern: { js: 'https://itzpulsev2.github.io/modernclient/js/', wasm: 'https://itzpulsev2.github.io/modernclient/wasm/' },
    aero:   { js: 'https://itzpulsev2.github.io/AeroClient/' + currentAeroVer + '/js.html', wasm: 'https://itzpulsev2.github.io/AeroClient/' + currentAeroVer + '/wasm.html' }
  };
  const clientLabels = { modern: 'Modern Client', tuff: 'Tuff Client', aero: 'Aero Client' };
  if (ver === 'js') {
    numEl.textContent = 'Javascript Build';
    labelEl.textContent = clientLabels[currentGame] || 'Client';
    if (currentGame === 'tuff') { updateTuffPlayUrl(); }
    else if (currentGame === 'aero') { updateAeroPlayUrl(); }
    else if (buildUrls[currentGame]) { playBtn.href = buildUrls[currentGame].js; }
    document.getElementById('opt-js-label').textContent = 'Javascript Build ✓';
    document.getElementById('opt-wasm-label').textContent = 'WASM Build';
  } else {
    numEl.textContent = 'WASM Build';
    labelEl.textContent = clientLabels[currentGame] || 'Client';
    if (currentGame === 'tuff') { updateTuffPlayUrl(); }
    else if (currentGame === 'aero') { updateAeroPlayUrl(); }
    else if (buildUrls[currentGame]) { playBtn.href = buildUrls[currentGame].wasm; }
    document.getElementById('opt-wasm-label').textContent = 'WASM Build ✓';
    document.getElementById('opt-js-label').textContent = 'Javascript Build';
  }

  dd.style.display = 'none';
  arrow.textContent = '▾';
}

// Close dropdown when clicking outside


function openSettings() {
  document.getElementById('settingsModal').style.display = 'flex';
}
function closeSettings() {
  document.getElementById('settingsModal').style.display = 'none';
}



async function toggleMusic() {
  if (!musicOn) {
    if (musicFiles.length === 0) await loadPlaylist();
    if (musicFiles.length === 0) {
      alert('No tracks found!\nMake sure music/playlist.json exists.');
      return;
    }
    musicOn = true;
    setToggleState(true);
    playTrack(musicIndex);
  } else {
    musicOn = false;
    audioEl.pause();
    audioEl.src = '';
    setToggleState(false);
    document.getElementById('nowPlayingRow').style.display = 'none';
  }
}

function playTrack(index) {
  musicIndex = ((index % musicFiles.length) + musicFiles.length) % musicFiles.length;
  audioEl.src = musicFiles[musicIndex];
  audioEl.play().catch(() => {});
  const name = musicFiles[musicIndex].replace('music/', '').replace('.mp3', '');
  document.getElementById('nowPlayingText').textContent = '🎵 ' + name;
  document.getElementById('nowPlayingRow').style.display = 'flex';
  audioEl.onended = () => { if (musicOn) playTrack(musicIndex + 1); };
}

function nextTrack() { if (musicOn) playTrack(musicIndex + 1); }
function prevTrack() { if (musicOn) playTrack(musicIndex - 1); }

function setToggleState(on) {
  const track = document.getElementById('toggleTrack');
  const label = document.getElementById('toggleLabel');
  if (on) { track.classList.add('on'); label.textContent = 'ON'; }
  else { track.classList.remove('on'); label.textContent = 'OFF'; }
}

function openWhatsNew() {
  document.getElementById('whatsnewModal').style.display = 'flex';
}
function closeWhatsNew() {
  document.getElementById('whatsnewModal').style.display = 'none';
}

document.addEventListener('click', function(e) {
  const selectorIds = ['versionSelector', 'tuffVerSelector', 'aeroVerSelector'];
  // Check if click was inside any selector
  const clickedInsideAnySelector = selectorIds.some(id => {
    const el = document.getElementById(id);
    return el && el.contains(e.target);
  });
  // If click was outside all selectors, close all dropdowns
  if (!clickedInsideAnySelector) {
    closeAllDropdowns();
  }
}, true);