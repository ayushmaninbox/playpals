// Spotify API credentials
const clientId = 'c5e500a246a54a56a4ffa81f9936b114';
const clientSecret = 'e8c0f2da32424fc687dbe4469ce7896d';
let accessToken = '';
let currentPlaylist = [];
let currentTrackIndex = 0;
let trendingTrack = null;
let isShuffled = false;
let isRepeating = false;

// DOM Elements
const menuOpen = document.getElementById('menu-open');
const menuClose = document.getElementById('menu-close');
const sidebar = document.querySelector('.container .sidebar');
const audioPlayer = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause');
const progressBar = document.querySelector('.progress-fill');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const nextTrackButton = document.getElementById('next-track');
const prevTrackButton = document.getElementById('prev-track');
const shuffleButton = document.getElementById('shuffle-button');
const repeatButton = document.getElementById('repeat-button');
const searchInput = document.querySelector('.search input');

// Event Listeners
menuOpen.addEventListener('click', () => sidebar.style.left = '0');
menuClose.addEventListener('click', () => sidebar.style.left = '-100%');

playPauseButton.addEventListener('click', togglePlayPause);
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('loadedmetadata', setDuration);
document.querySelector('.progress-bar').addEventListener('click', seek);
nextTrackButton.addEventListener('click', playNextTrack);
prevTrackButton.addEventListener('click', playPreviousTrack);
shuffleButton.addEventListener('click', toggleShuffle);
repeatButton.addEventListener('click', toggleRepeat);
searchInput.addEventListener('keypress', handleSearch);
document.getElementById('listen-now').addEventListener('click', playTrendingTrack);
audioPlayer.addEventListener('ended', handleTrackEnd);

// Spotify API Functions
async function getAccessToken() {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

async function searchTracks(query) {
    const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data.tracks.items;
}

async function getNewReleases() {
    const result = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=1', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data.albums.items[0];
}

async function getTopTracks() {
    const result = await fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=5', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data.items;
}

async function getTrackDetails(trackId) {
    const result = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data;
}

// Player Functions
function playTrack(track) {
    audioPlayer.src = track.preview_url;
    audioPlayer.play();
    updateCurrentSongInfo(track);
    updatePlayPauseButton(true);
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        updatePlayPauseButton(true);
    } else {
        audioPlayer.pause();
        updatePlayPauseButton(false);
    }
}

function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
}

function setDuration() {
    durationDisplay.textContent = formatTime(audioPlayer.duration);
}

function seek(e) {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const clickPercentage = (clickPosition / progressBarWidth);
    audioPlayer.currentTime = clickPercentage * audioPlayer.duration;
}

function playNextTrack() {
    if (isShuffled) {
        currentTrackIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else if (currentTrackIndex < currentPlaylist.length - 1) {
        currentTrackIndex++;
    } else if (isRepeating) {
        currentTrackIndex = 0;
    } else {
        return;
    }
    playTrack(currentPlaylist[currentTrackIndex]);
}

function playPreviousTrack() {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
        playTrack(currentPlaylist[currentTrackIndex]);
    }
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleButton.classList.toggle('bx-shuffle', isShuffled);
    shuffleButton.classList.toggle('bx-sort', !isShuffled);
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatButton.classList.toggle('bx-repeat', !isRepeating);
    repeatButton.classList.toggle('bx-repeat-1', isRepeating);
}

function handleTrackEnd() {
    playNextTrack();
}

// UI Update Functions
function updateTrendingSection(album) {
    document.getElementById('trending-title').textContent = "Perfect";
    document.getElementById('trending-artist').textContent = "Ed Sheeran";
    document.getElementById('trending-plays').textContent = `${Math.floor(Math.random() * 1000000)} plays`;
    document.getElementById('trending-image').src = "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96";
    trendingTrack = {
        name: "Perfect",
        artists: [{ name: "Ed Sheeran" }],
        album: {
            name: "÷ (Deluxe)",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96" }]
        },
        preview_url: "https://p.scdn.co/mp3-preview/9779493d90a47f29e4257aa45bc6146d1ee9cb26?cid=c5e500a246a54a56a4ffa81f9936b114"
    };
}

function updateTopSongsSection(tracks) {
    const topSongsContainer = document.getElementById('top-songs');
    topSongsContainer.innerHTML = '';

    tracks.forEach((item, index) => {
        const track = item.track;
        const songElement = document.createElement('div');
        songElement.className = 'item';
        songElement.innerHTML = `
            <div class="info">
                <img src="${track.album.images[0].url}" alt="${track.name}">
                <div>
                    <h5>${track.name}</h5>
                    <p>${track.artists[0].name}</p>
                </div>
            </div>
            <div class="actions">
                <p>${formatDuration(track.duration_ms)}</p>
                <div class="icon">
                    <i class='bx bx-play'></i>
                </div>
                <i class='bx bx-dots-vertical-rounded'></i>
            </div>
        `;
        songElement.addEventListener('click', () => {
            currentPlaylist = tracks.map(item => item.track);
            currentTrackIndex = index;
            playTrack(track);
        });
        topSongsContainer.appendChild(songElement);
    });
}

function updateCurrentSongInfo(track) {
    document.getElementById('current-song-image').src = track.album.images[0].url;
    document.getElementById('current-song-title').textContent = track.name;
    document.getElementById('current-song-artist').textContent = track.artists[0].name;
    document.getElementById('current-song-album').textContent = track.album.name;
}

function updatePlayPauseButton(isPlaying) {
    if (isPlaying) {
        playPauseButton.classList.remove('bxs-right-arrow');
        playPauseButton.classList.add('bx-pause');
    } else {
        playPauseButton.classList.remove('bx-pause');
        playPauseButton.classList.add('bxs-right-arrow');
    }
}

// Utility Functions
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Event Handlers
async function handleSearch(e) {
    if (e.key === 'Enter') {
        const tracks = await searchTracks(searchInput.value);
        updateTopSongsSection(tracks.map(track => ({ track })));
    }
}

function playTrendingTrack() {
    if (trendingTrack) {
        playTrack(trendingTrack);
    }
}

// Initialization
async function init() {
    accessToken = await getAccessToken();
    const newRelease = await getNewReleases();
    const topTracks = await getTopTracks();

    updateTrendingSection(newRelease);
    updateTopSongsSection(topTracks);

    // Set default song
    const defaultTrackId = '2D1TTiw2pRycUrGamzloUS';
    const defaultTrack = await getTrackDetails(defaultTrackId);
    updateCurrentSongInfo(defaultTrack);
}

// Start the application
window.addEventListener('load', init);