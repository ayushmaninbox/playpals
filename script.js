const menuOpen = document.getElementById('menu-open');
const menuClose = document.getElementById('menu-close');
const sidebar = document.querySelector('.container .sidebar');

menuOpen.addEventListener('click', () => sidebar.style.left = '0');
menuClose.addEventListener('click', () => sidebar.style.left = '-100%');

const audioPlayer = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause');
const progressBar = document.querySelector('.progress-fill');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');

playPauseButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.classList.remove('bxs-right-arrow');
        playPauseButton.classList.add('bx-pause');
    } else {
        audioPlayer.pause();
        playPauseButton.classList.remove('bx-pause');
        playPauseButton.classList.add('bxs-right-arrow');
    }
});

audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('loadedmetadata', () => {
    durationDisplay.textContent = formatTime(audioPlayer.duration);
});

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.querySelector('.progress-bar').addEventListener('click', (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const clickPercentage = (clickPosition / progressBarWidth);
    audioPlayer.currentTime = clickPercentage * audioPlayer.duration;
});

// Update current song info
function updateCurrentSongInfo(track) {
    document.getElementById('current-song-image').src = track.album.images[0].url;
    document.getElementById('current-song-title').textContent = track.name;
    document.getElementById('current-song-artist').textContent = track.artists[0].name;
    document.getElementById('current-song-album').textContent = track.album.name;
}

// Listen for custom event from spotify-integration.js
document.addEventListener('songSelected', (e) => {
    updateCurrentSongInfo(e.detail);
});