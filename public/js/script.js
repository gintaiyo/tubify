let player = null;
let isReady = false;
let currentSearchResults = [];
let upNextQueue = [];
let currentTrack = null;

let likedSongs = JSON.parse(localStorage.getItem('tubify_liked')) || [];
let playlists = JSON.parse(localStorage.getItem('tubify_playlists')) || [];
let savedVolume = localStorage.getItem('tubify_volume') || 70;
let isMuted = false;
let isShuffle = false;
let isLoop = false;
let smartMixEnabled = true;

// 🚀 Curated Home Categories
const homeCategories = [
  {
    title: "Trending Today 🚀",
    tracks: [
      { id: "34Na4j8AVgA", title: "Starboy", artist: "The Weeknd ft. Daft Punk", cover: "https://i.ytimg.com/vi/34Na4j8AVgA/mqdefault.jpg" },
      { id: "4NRXx6U8ABQ", title: "Blinding Lights", artist: "The Weeknd", cover: "https://i.ytimg.com/vi/4NRXx6U8ABQ/mqdefault.jpg" },
      { id: "JGwWNGJdvx8", title: "Shape of You", artist: "Ed Sheeran", cover: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg" },
      { id: "TUVcZfQe-Kw", title: "Levitating", artist: "Dua Lipa", cover: "https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg" }
    ]
  },
  {
    title: "Lo-Fi & Chill ☕",
    tracks: [
      { id: "jfKfPfyJRdk", title: "Lofi Hip Hop Radio - Beats to Relax/Study to", artist: "Lofi Girl", cover: "https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg" },
      { id: "5qap5aO4i9A", title: "Lofi Beats for Night Time", artist: "ChilledCow", cover: "https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg" },
      { id: "DWcJFNfaw9c", title: "Coffee Shop Beats", artist: "ChillHop Music", cover: "https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg" },
      { id: "TURbeWK2wwg", title: "Midnight Lo-Fi Chill", artist: "Aesthetic Sounds", cover: "https://i.ytimg.com/vi/TURbeWK2wwg/mqdefault.jpg" }
    ]
  }
];

// 🎧 Curated Home Playlists
const featuredPlaylists = [
  {
    name: "XO Essentials",
    description: "Top hits from Abel Tesfaye (The Weeknd)",
    icon: "fa-solid fa-crown",
    tracks: [
      { id: "34Na4j8AVgA", title: "Starboy", artist: "The Weeknd ft. Daft Punk", cover: "https://i.ytimg.com/vi/34Na4j8AVgA/mqdefault.jpg" },
      { id: "4NRXx6U8ABQ", title: "Blinding Lights", artist: "The Weeknd", cover: "https://i.ytimg.com/vi/4NRXx6U8ABQ/mqdefault.jpg" },
      { id: "xxM3O_L_jI4", title: "Save Your Tears", artist: "The Weeknd", cover: "https://i.ytimg.com/vi/xxM3O_L_jI4/mqdefault.jpg" },
      { id: "yzTuBuRdAyA", title: "The Hills", artist: "The Weeknd", cover: "https://i.ytimg.com/vi/yzTuBuRdAyA/mqdefault.jpg" },
      { id: "KEI4qS4P0S0", title: "Can't Feel My Face", artist: "The Weeknd", cover: "https://i.ytimg.com/vi/KEI4qS4P0S0/mqdefault.jpg" },
      { id: "waU75jdUnYw", title: "Earned It", artist: "The Weeknd", cover: "https://i.ytimg.com/vi/waU75jdUnYw/mqdefault.jpg" },
      { id: "1DpH-icPpl0", title: "Call Out My Name", artist: "The Weeknd", cover: "https://i.ytimg.com/vi/1DpH-icPpl0/mqdefault.jpg" },
      { id: "M4ZoCHID9GI", title: "Heartless", artist: "The Weeknd", cover: "https://i.ytimg.com/vi/M4ZoCHID9GI/mqdefault.jpg" }
    ]
  },
  {
    name: "808s & Heartbeats",
    description: "Major Hip-Hop Anthems",
    icon: "fa-solid fa-compact-disc",
    tracks: [
      { id: "uxpDa-c-4Mc", title: "Sicko Mode", artist: "Travis Scott", cover: "https://i.ytimg.com/vi/uxpDa-c-4Mc/mqdefault.jpg" },
      { id: "0yp58EIn6yA", title: "God's Plan", artist: "Drake", cover: "https://i.ytimg.com/vi/0yp58EIn6yA/mqdefault.jpg" },
      { id: "tvTRZJ-4EyI", title: "HUMBLE.", artist: "Kendrick Lamar", cover: "https://i.ytimg.com/vi/tvTRZJ-4EyI/mqdefault.jpg" }
    ]
  },
  {
    name: "Deep Pulse & Echoes",
    description: "Atmospheric Deep House & Progressive Electronic",
    icon: "fa-solid fa-bolt",
    tracks: [
      { id: "L_LUpnjgPso", title: "Losing It", artist: "FISHER", cover: "https://i.ytimg.com/vi/L_LUpnjgPso/mqdefault.jpg" }
    ]
  },
  {
    name: "Pop Royalty",
    description: "Global Chart Toppers & Mainstream Pop",
    icon: "fa-solid fa-star",
    tracks: [
      { id: "eVli-tstM5E", title: "Espresso", artist: "Sabrina Carpenter", cover: "https://i.ytimg.com/vi/eVli-tstM5E/mqdefault.jpg" },
      { id: "TUVcZfQe-Kw", title: "Levitating", artist: "Dua Lipa", cover: "https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg" }
    ]
  }
];

function initPlayer() {
  if (player) return;
  
  if (window.YT && window.YT.Player) {
    player = new YT.Player('yt-hidden-player', {
      height: '1',
      width: '1',
      playerVars: {
        'autoplay': 1,
        'controls': 0,
        'disablekb': 1,
        'enablejsapi': 1,
        'origin': window.location.origin
      },
      events: {
        'onReady': () => { 
          isReady = true; 
          setVolume(savedVolume);
        },
        'onStateChange': onPlayerStateChange
      }
    });
  }
}

function onYouTubeIframeAPIReady() {
  initPlayer();
}

const playBtn = document.getElementById("playBtn");

// 🔍 Search Handler
async function handleSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  
  const q = searchInput.value.trim();
  if (!q) return;

  const main = document.getElementById("mainContent");
  main.style.background = "radial-gradient(circle at top left, #1a090c 0%, #0d1410 40%)";
  
  main.innerHTML = `
    <div class="search-bar-container">
      <div class="search-input-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input type="text" id="searchInput" class="search-input" value="${q}" placeholder="What do you want to listen to?" oninput="filterTracksLive()" />
      </div>
      <button class="btn-search" onclick="handleSearch()">Search</button>
    </div>
    <h2 class="section-title" id="heading">Results for "${q}"</h2>
    <div class="track-grid" id="trackGrid">
      <div style="color: var(--text-muted); grid-column: 1/-1;">Searching Tubify...</div>
    </div>
  `;

  bindSearchKey();

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const tracks = await res.json();
    currentSearchResults = tracks;
    renderTracks(tracks);
  } catch (err) {
    const grid = document.getElementById("trackGrid");
    if (grid) grid.innerHTML = `<div style="color: var(--tubify-red); grid-column: 1/-1;">Failed to search tracks.</div>`;
  }
}

function bindSearchKey() {
  const input = document.getElementById("searchInput");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    });
  }
}

function filterTracksLive() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  
  const query = input.value.toLowerCase().trim();
  if (!query) {
    renderTracks(currentSearchResults);
    return;
  }
  const filtered = currentSearchResults.filter(t => 
    t.title.toLowerCase().includes(query) || 
    t.artist.toLowerCase().includes(query)
  );
  renderTracks(filtered);
}

// 🟢 Updates Active Highlight & Wave Animation across all grids
function updateActiveCardHighlight() {
  document.querySelectorAll('.track-card').forEach(card => {
    const trackId = card.getAttribute('data-track-id');
    const titleEl = card.querySelector('.track-title');

    if (currentTrack && trackId === currentTrack.id) {
      card.classList.add('playing');
      if (titleEl && !titleEl.querySelector('.wave-icon')) {
        titleEl.insertAdjacentHTML('afterbegin', `<i class="fa-solid fa-lines-leaning wave-icon" style="color: var(--tubify-green); margin-right: 6px;"></i>`);
      }
    } else {
      card.classList.remove('playing');
      if (titleEl) {
        const icon = titleEl.querySelector('.wave-icon');
        if (icon) icon.remove();
      }
    }
  });
}

function renderTracks(tracks, targetGridId = "trackGrid") {
  const container = document.getElementById(targetGridId);
  if (!container) return;
  container.innerHTML = "";

  tracks.forEach((track) => {
    const card = document.createElement("div");
    card.className = "track-card";
    card.setAttribute('data-track-id', track.id);
    const isLiked = likedSongs.some(s => s.id === track.id);
    const isPlaying = currentTrack && currentTrack.id === track.id;

    if (isPlaying) card.classList.add('playing');

    card.onclick = function(e) {
      if (e.target.closest('.card-actions')) return;
      playSong(track);
    };

    card.innerHTML = `
      <div class="card-actions">
        <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(event, '${track.id}')">
          <i class="fa-solid fa-heart"></i>
        </button>
        <button class="action-btn" onclick="toggleDropdown(event, '${track.id}')">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
        <div class="dropdown-menu" id="dropdown-${track.id}">
          <div class="dropdown-item" onclick="addToQueue(event, '${track.id}')"><i class="fa-solid fa-plus"></i> Add to Queue</div>
          ${playlists.map(pl => `
            <div class="dropdown-item" onclick="addToPlaylist(event, '${track.id}', '${pl.name}')">
              <i class="fa-solid fa-music"></i> Add to ${pl.name}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card-img-wrapper">
        <img src="${track.cover}" class="track-img" onerror="this.onerror=null; this.src='https://picsum.photos/300/300?blur=2';" />
        <div class="play-btn-float"><i class="fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}"></i></div>
      </div>
      <div class="track-title">${isPlaying ? '<i class="fa-solid fa-lines-leaning wave-icon" style="color: var(--tubify-green); margin-right: 6px;"></i>' : ''}${track.title}</div>
      <div class="track-artist">${track.artist}</div>
    `;
    container.appendChild(card);
  });
}

function renderFeaturedPlaylists() {
  const wrapper = document.getElementById("featuredPlaylistsGrid");
  if (!wrapper) return;
  wrapper.innerHTML = "";

  featuredPlaylists.forEach((pl) => {
    const card = document.createElement("div");
    card.className = "track-card playlist-card";
    card.onclick = () => loadFeaturedPlaylist(pl.name);

    card.innerHTML = `
      <div class="card-img-wrapper playlist-img-bg">
        <i class="${pl.icon}"></i>
        <div class="play-btn-float"><i class="fa-solid fa-play"></i></div>
      </div>
      <div class="track-title">${pl.name}</div>
      <div class="track-artist">${pl.description}</div>
    `;
    wrapper.appendChild(card);
  });
}

function loadFeaturedPlaylist(plName) {
  const pl = featuredPlaylists.find(p => p.name === plName);
  if (!pl) return;
  renderBannerView(pl.name, "Featured Playlist", pl.icon, pl.tracks, "radial-gradient(circle at top left, #1a090c 0%, #0d1410 40%)");
}

function toggleDropdown(e, trackId) {
  e.stopPropagation();
  document.querySelectorAll('.dropdown-menu').forEach(el => el.style.display = 'none');
  const menu = document.getElementById(`dropdown-${trackId}`);
  if (menu) menu.style.display = 'block';
}

document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-menu').forEach(el => el.style.display = 'none');
});

function getAllFeaturedTracks() {
  let all = [];
  homeCategories.forEach(cat => { all = all.concat(cat.tracks); });
  featuredPlaylists.forEach(pl => { all = all.concat(pl.tracks); });
  return all;
}

function addToQueue(e, trackId) {
  e.stopPropagation();
  const track = currentSearchResults.concat(likedSongs).concat(getAllFeaturedTracks()).find(t => t.id === trackId);
  if (track) {
    upNextQueue.push(track);
    renderQueue();
  }
}

function removeFromQueue(index) {
  upNextQueue.splice(index, 1);
  renderQueue();
}

function clearQueue() {
  upNextQueue = [];
  renderQueue();
}

function renderQueue() {
  const qContainer = document.getElementById("queueList");
  if (!qContainer) return;

  if (upNextQueue.length === 0) {
    qContainer.innerHTML = "Queue is empty";
    return;
  }

  qContainer.innerHTML = "";
  upNextQueue.forEach((item, idx) => {
    const row = document.createElement("div");
    row.className = "queue-item";
    row.innerHTML = `
      <div class="queue-info" onclick="playQueueIndex(${idx})">
        <img src="${item.cover}" class="queue-img" onerror="this.onerror=null; this.src='https://picsum.photos/100/100';" />
        <div class="queue-details">
          <div class="queue-name">${item.title}</div>
          <div class="queue-artist">${item.artist}</div>
        </div>
      </div>
      <button class="btn-remove-q" onclick="removeFromQueue(${idx})"><i class="fa-solid fa-xmark"></i></button>
    `;
    qContainer.appendChild(row);
  });
}

function playQueueIndex(idx) {
  const track = upNextQueue[idx];
  upNextQueue.splice(idx, 1);
  renderQueue();
  playSong(track);
}

// 🎨 Dynamic Adaptive Ambient Background
function updateAmbientGlow(coverUrl) {
  const main = document.getElementById("mainContent");
  if (!main || !coverUrl) return;

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = coverUrl;

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 50;
    canvas.height = 50;
    ctx.drawImage(img, 0, 0, 50, 50);

    const data = ctx.getImageData(10, 10, 30, 30).data;
    let r = 0, g = 0, b = 0;

    for (let i = 0; i < data.length; i += 16) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    const count = data.length / 16;
    r = Math.floor((r / count) * 0.4);
    g = Math.floor((g / count) * 0.4);
    b = Math.floor((b / count) * 0.4);

    main.style.transition = "background 0.8s ease-in-out";
    main.style.background = `radial-gradient(circle at top left, rgb(${r + 30}, ${g + 10}, ${b + 20}) 0%, #0d1410 50%)`;
  };
}

// 🎵 Track Playback Engine
function playSong(track) {
  if (!track) return;

  if (!player || !isReady) {
    initPlayer();
    setTimeout(() => playSong(track), 400);
    return;
  }

  currentTrack = track;
  updateActiveCardHighlight();

  const titleEl = document.getElementById("currentTitle");
  const artistEl = document.getElementById("currentArtist");
  const coverEl = document.getElementById("currentCover");

  if (titleEl) titleEl.innerText = track.title.slice(0, 30);
  if (artistEl) artistEl.innerText = track.artist;
  if (coverEl) coverEl.src = track.cover;

  updateAmbientGlow(track.cover);

  const fill = document.getElementById("progressFill");
  const curr = document.getElementById("currTime");
  const total = document.getElementById("totalTime");

  if (fill) fill.style.width = "0%";
  if (curr) curr.innerText = "0:00";
  if (total) total.innerText = "0:00";

  if (typeof player.loadVideoById === 'function') {
    player.loadVideoById({
      videoId: track.id,
      startSeconds: 0,
      suggestedQuality: 'small'
    });
    player.playVideo();
  }

  if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
}

function playPlaylistFromStart() {
  if (currentSearchResults && currentSearchResults.length > 0) {
    const firstSong = currentSearchResults[0];
    upNextQueue = [...currentSearchResults.slice(1)];
    renderQueue();
    playSong(firstSong);
  }
}

// 🔀 Smart Mix Auto-Play
async function triggerSmartMix() {
  if (!currentTrack || !smartMixEnabled) return;
  try {
    const q = `${currentTrack.artist} similar music`;
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const tracks = await res.json();
    const filtered = tracks.filter(t => t.id !== currentTrack.id).slice(0, 5);

    if (filtered.length > 0) {
      upNextQueue = filtered;
      renderQueue();
      playNextTrack();
    }
  } catch (err) {
    console.log("Smart Mix auto-play fetch failed:", err);
  }
}

function playNextTrack() {
  if (upNextQueue.length > 0) {
    playQueueIndex(0);
  } else if (smartMixEnabled) {
    triggerSmartMix();
  } else if (currentSearchResults.length > 0) {
    const nextIdx = isShuffle ? Math.floor(Math.random() * currentSearchResults.length) : 0;
    playSong(currentSearchResults[nextIdx]);
  }
}

function playPrevTrack() {
  if (currentSearchResults.length > 0) {
    playSong(currentSearchResults[0]);
  }
}

function togglePlay() {
  if (!player || !isReady) return;
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
    if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  } else {
    player.playVideo();
    if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  }
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  } else if (event.data === YT.PlayerState.PAUSED) {
    if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  } else if (event.data === YT.PlayerState.BUFFERING) {
    if (playBtn) playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  } else if (event.data === YT.PlayerState.ENDED) {
    if (isLoop && currentTrack) {
      player.playVideo();
    } else {
      playNextTrack();
    }
  }
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  const btn = document.getElementById("shuffleBtn");
  if (btn) btn.classList.toggle("active", isShuffle);
}

function toggleLoop() {
  isLoop = !isLoop;
  const btn = document.getElementById("loopBtn");
  if (btn) btn.classList.toggle("active", isLoop);
}

function toggleMute() {
  if (!player) return;
  const muteBtn = document.getElementById("muteBtn");
  if (isMuted) {
    player.unMute();
    if (muteBtn) muteBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    isMuted = false;
  } else {
    player.mute();
    if (muteBtn) muteBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    isMuted = true;
  }
}

function setVolume(val) {
  if (player && player.setVolume) {
    player.setVolume(val);
    localStorage.setItem('tubify_volume', val);
  }
}

function toggleLike(e, trackId) {
  e.stopPropagation();
  const track = currentSearchResults.concat(upNextQueue).concat(getAllFeaturedTracks()).find(t => t.id === trackId);
  if (!track) return;

  const idx = likedSongs.findIndex(s => s.id === trackId);
  if (idx > -1) {
    likedSongs.splice(idx, 1);
  } else {
    likedSongs.push(track);
  }
  localStorage.setItem('tubify_liked', JSON.stringify(likedSongs));
  loadMainView();
}

function addToPlaylist(e, trackId, plName) {
  e.stopPropagation();
  const track = currentSearchResults.concat(getAllFeaturedTracks()).find(t => t.id === trackId);
  const pl = playlists.find(p => p.name === plName);
  if (track && pl) {
    if (!pl.tracks.some(t => t.id === track.id)) {
      pl.tracks.push(track);
      localStorage.setItem('tubify_playlists', JSON.stringify(playlists));
      renderPlaylists();
    }
  }
}

function openPlaylistModal() {
  const modal = document.getElementById("plModal");
  const input = document.getElementById("plInput");
  if (modal) modal.style.display = "flex";
  if (input) input.focus();
}

function closePlaylistModal() {
  const modal = document.getElementById("plModal");
  const input = document.getElementById("plInput");
  if (modal) modal.style.display = "none";
  if (input) input.value = "";
}

function confirmCreatePlaylist() {
  const input = document.getElementById("plInput");
  if (!input) return;
  const name = input.value.trim();
  if (!name) return;
  playlists.push({ name, tracks: [] });
  localStorage.setItem('tubify_playlists', JSON.stringify(playlists));
  renderPlaylists();
  closePlaylistModal();
}

function deletePlaylist(e, plName) {
  e.stopPropagation();
  playlists = playlists.filter(p => p.name !== plName);
  localStorage.setItem('tubify_playlists', JSON.stringify(playlists));
  renderPlaylists();
  loadMainView();
}

function renderPlaylists() {
  const plList = document.getElementById("playlistList");
  if (!plList) return;
  plList.innerHTML = "";
  playlists.forEach((pl) => {
    const li = document.createElement("li");
    li.className = "pl-item";
    li.onclick = () => loadPlaylist(pl.name);
    li.innerHTML = `
      <div class="pl-name-wrap">
        <i class="fa-solid fa-music"></i>
        <span class="pl-title">${pl.name}</span>
      </div>
      <button class="btn-del-pl" onclick="deletePlaylist(event, '${pl.name}')"><i class="fa-solid fa-trash"></i></button>
    `;
    plList.appendChild(li);
  });
}

function renderBannerView(title, tag, iconClass, tracks, bgGradient) {
  const main = document.getElementById("mainContent");
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  main.style.background = bgGradient;
  currentSearchResults = tracks || [];

  main.innerHTML = `
    <div class="search-bar-container">
      <div class="search-input-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input type="text" id="searchInput" class="search-input" placeholder="What do you want to listen to?" oninput="filterTracksLive()" />
      </div>
      <button class="btn-search" onclick="handleSearch()">Search</button>
    </div>

    <div class="playlist-banner">
      <div class="banner-img"><i class="${iconClass}"></i></div>
      <div class="banner-info">
        <span class="banner-tag">${tag}</span>
        <h1 class="banner-title">${title}</h1>
        <div class="banner-meta">
          <span><b>${currentSearchResults.length}</b> songs</span>
          ${currentSearchResults.length > 0 ? `<button class="btn-play-hero" onclick="playPlaylistFromStart()"><i class="fa-solid fa-play"></i></button>` : ''}
        </div>
      </div>
    </div>

    <div class="track-grid" id="trackGrid"></div>
  `;

  renderTracks(currentSearchResults);
  bindSearchKey();
}

function loadPlaylist(plName) {
  const pl = playlists.find(p => p.name === plName);
  if (!pl) return;
  renderBannerView(pl.name, "Playlist", "fa-solid fa-compact-disc", pl.tracks, "radial-gradient(circle at top left, #1a090c 0%, #0d1410 40%)");
}

function loadLikedSongs() {
  const navLiked = document.getElementById("navLiked");
  if (navLiked) navLiked.classList.add("active");
  renderBannerView("Liked Songs", "Playlist", "fa-solid fa-heart", likedSongs, "radial-gradient(circle at top left, #1a090c 0%, #0d1410 40%)");
}

function loadMainView() {
  const main = document.getElementById("mainContent");
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navHome = document.getElementById("navHome");
  if (navHome) navHome.classList.add("active");

  main.style.background = "radial-gradient(circle at top left, #1a090c 0%, #0d1410 40%)";
  currentSearchResults = getAllFeaturedTracks();

  let html = `
    <div class="search-bar-container">
      <div class="search-input-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input type="text" id="searchInput" class="search-input" placeholder="What do you want to listen to?" oninput="filterTracksLive()" />
      </div>
      <button class="btn-search" onclick="handleSearch()">Search</button>
    </div>
    
    <div style="margin-bottom:36px;">
      <h2 class="section-title">Featured Playlists 📀</h2>
      <div class="track-grid" id="featuredPlaylistsGrid"></div>
    </div>

    <div id="homeCategoriesWrapper"></div>
  `;

  main.innerHTML = html;

  renderFeaturedPlaylists();

  const wrapper = document.getElementById("homeCategoriesWrapper");
  homeCategories.forEach((cat, idx) => {
    const section = document.createElement("div");
    section.style.marginBottom = "32px";
    section.innerHTML = `
      <h2 class="section-title">${cat.title}</h2>
      <div class="track-grid" id="catGrid-${idx}"></div>
    `;
    wrapper.appendChild(section);
    
    const limitedTracks = cat.tracks.slice(0, 4);
    renderTracks(limitedTracks, `catGrid-${idx}`);
  });

  bindSearchKey();
}

function formatTime(sec) {
  if (isNaN(sec) || sec === null) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

setInterval(() => {
  if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
    const currentTime = player.getCurrentTime() || 0;
    const duration = player.getDuration() || 0;

    if (duration > 0) {
      const pct = (currentTime / duration) * 100;
      const fill = document.getElementById("progressFill");
      const curr = document.getElementById("currTime");
      const total = document.getElementById("totalTime");

      if (fill) fill.style.width = pct + "%";
      if (curr) curr.innerText = formatTime(currentTime);
      if (total) total.innerText = formatTime(duration);
    }
  }
}, 250);

function seekTrack(e) {
  if (!player || typeof player.getDuration !== 'function') return;
  const bar = document.getElementById("progressBar");
  if (!bar) return;
  const pct = e.offsetX / bar.clientWidth;
  const duration = player.getDuration();
  if (duration > 0) {
    player.seekTo(pct * duration, true);
  }
}

// ⌨️ Expanded Keyboard Shortcuts Handler
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }

  if (e.code === "KeyM") {
    e.preventDefault();
    toggleMute();
  }

  if (e.code === "KeyL") {
    e.preventDefault();
    if (currentTrack) {
      const fakeEvent = { stopPropagation: () => {} };
      toggleLike(fakeEvent, currentTrack.id);
    }
  }

  if (e.code === "ArrowRight") {
    e.preventDefault();
    if (player && typeof player.getCurrentTime === 'function') {
      player.seekTo(player.getCurrentTime() + 5, true);
    }
  }

  if (e.code === "ArrowLeft") {
    e.preventDefault();
    if (player && typeof player.getCurrentTime === 'function') {
      player.seekTo(Math.max(0, player.getCurrentTime() - 5), true);
    }
  }

  if (e.code === "ArrowUp") {
    e.preventDefault();
    const slider = document.querySelector(".vol-slider");
    if (slider) {
      slider.value = Math.min(100, parseInt(slider.value) + 5);
      setVolume(slider.value);
    }
  }

  if (e.code === "ArrowDown") {
    e.preventDefault();
    const slider = document.querySelector(".vol-slider");
    if (slider) {
      slider.value = Math.max(0, parseInt(slider.value) - 5);
      setVolume(slider.value);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const volSlider = document.querySelector(".vol-slider");
  if (volSlider) volSlider.value = savedVolume;
  renderPlaylists();
  loadMainView();
  initPlayer();
});