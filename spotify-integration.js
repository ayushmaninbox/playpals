const clientId = 'c5e500a246a54a56a4ffa81f9936b114';
const clientSecret = 'e8c0f2da32424fc687dbe4469ce7896d';
let accessToken = '';
let currentPlaylist = [];
let currentTrackIndex = 0;
let trendingTrack = null;
let isShuffled = false;
let isRepeating = false;

// Function to get the access token
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

// Function to search for tracks
async function searchTracks(query) {
    const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data.tracks.items;
}

// Function to get new releases
async function getNewReleases() {
    const result = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=1', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data.albums.items[0];
}

// Function to get top tracks
async function getTopTracks() {
    const result = await fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=5', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data.items;
}

// Function to get track details
async function getTrackDetails(trackId) {
    const result = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data;
}

// Function to play a track
function playTrack(track) {
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = track.preview_url;
    audioPlayer.play();
    updateCurrentSongInfo(track);
    updatePlayPauseButton(true);
}

// Function to update the trending section
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

// Function to update the top songs section
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

// Function to format duration
function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to update current song info
function updateCurrentSongInfo(track) {
    document.getElementById('current-song-title').textContent = track.name;
    document.getElementById('current-song-artist').textContent = track.artists[0].name;
    document.getElementById('current-song-album').textContent = track.album.name;
    document.getElementById('current-song-image').src = track.album.images[0].url;
}

// Function to update play/pause button
function updatePlayPauseButton(isPlaying) {
    const playPauseButton = document.getElementById('play-pause');
    if (isPlaying) {
        playPauseButton.classList.remove('bxs-right-arrow');
        playPauseButton.classList.add('bx-pause');
    } else {
        playPauseButton.classList.remove('bx-pause');
        playPauseButton.classList.add('bxs-right-arrow');
    }
}

// Function to play next track
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

// Function to play previous track
function playPreviousTrack() {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
        playTrack(currentPlaylist[currentTrackIndex]);
    }
}

// Initialize the application
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

    // Event listener for search
    const searchInput = document.querySelector('.search input');
    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const tracks = await searchTracks(searchInput.value);
            updateTopSongsSection(tracks.map(track => ({ track })));
        }
    });

    // Event listeners for player controls
    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const nextTrackButton = document.getElementById('next-track');
    const prevTrackButton = document.getElementById('prev-track');
    const shuffleButton = document.getElementById('shuffle-button');
    const repeatButton = document.getElementById('repeat-button');

    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            updatePlayPauseButton(true);
        } else {
            audioPlayer.pause();
            updatePlayPauseButton(false);
        }
    });

    nextTrackButton.addEventListener('click', playNextTrack);
    prevTrackButton.addEventListener('click', playPreviousTrack);

    shuffleButton.addEventListener('click', () => {
        isShuffled = !isShuffled;
        shuffleButton.classList.toggle('bx-shuffle', isShuffled);
        shuffleButton.classList.toggle('bx-sort', !isShuffled);
    });

    repeatButton.addEventListener('click', () => {
        isRepeating = !isRepeating;
        repeatButton.classList.toggle('bx-repeat', !isRepeating);
        repeatButton.classList.toggle('bx-repeat-1', isRepeating);
    });

    // Update progress bar
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.getElementById('current-time').textContent = formatDuration(audioPlayer.currentTime * 1000);
        document.getElementById('duration').textContent = formatDuration(audioPlayer.duration * 1000);
    });

    // Click on progress bar to seek
    document.querySelector('.progress-bar').addEventListener('click', (e) => {
        const progressBar = e.currentTarget;
        const clickPosition = (e.pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
        audioPlayer.currentTime = clickPosition * audioPlayer.duration;
    });

    // Listen Now button functionality
    document.getElementById('listen-now').addEventListener('click', () => {
        if (trendingTrack) {
            playTrack(trendingTrack);
        }
    });

    // Auto-play next song when current song ends
    audioPlayer.addEventListener('ended', playNextTrack);
}

// Call the init function when the page loads
window.addEventListener('load', init);