const clientId = 'c5e500a246a54a56a4ffa81f9936b114';
const clientSecret = 'e8c0f2da32424fc687dbe4469ce7896d';
let accessToken = '';

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
    const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data.tracks.items;
}

// Function to play a track
function playTrack(trackUrl) {
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = trackUrl;
    audioPlayer.play();
}

// Initialize Spotify Web Playback SDK
window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(accessToken); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
};

// Event listener for the search input
document.querySelector('.search input').addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        const query = event.target.value;
        const tracks = await searchTracks(query);
        displaySearchResults(tracks);
    }
});

// Function to display search results
function displaySearchResults(tracks) {
    const musicList = document.querySelector('.music-list .items');
    musicList.innerHTML = '';

    tracks.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.classList.add('item');
        trackElement.innerHTML = `
            <div class="info">
                <p>${index + 1}</p>
                <img src="${track.album.images[0].url}" alt="${track.name}">
                <div class="details">
                    <h5>${track.name}</h5>
                    <p>${track.artists[0].name}</p>
                </div>
            </div>
            <div class="actions">
                <p>${Math.floor(track.duration_ms / 60000)}:${((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}</p>
                <div class="icon">
                    <i class='bx bxs-right-arrow'></i>
                </div>
                <i class='bx bxs-plus-square'></i>
            </div>
        `;
        trackElement.querySelector('.icon').addEventListener('click', () => playTrack(track.preview_url));
        musicList.appendChild(trackElement);
    });
}

// Initialize the app
(async function init() {
    accessToken = await getAccessToken();
})();