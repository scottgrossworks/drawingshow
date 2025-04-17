// JS/video_player.js

let videosData = [];
let currentIndex = 0;

async function initVideoPlayer() {
    try {
        const response = await fetch('VID/all_vids.json');
        videosData = await response.json();

        if (!Array.isArray(videosData) || videosData.length === 0) {
            console.error('Error: no videos in all_vids.json');
            return;
        }

        // start with a random index
        currentIndex = Math.floor(Math.random() * videosData.length);
  

        // wire nav buttons
        document.getElementById('prevBtn').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + videosData.length) % videosData.length;
            showVideo(currentIndex);
        });
        document.getElementById('nextBtn').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % videosData.length;
            showVideo(currentIndex);
        });

        showVideo(currentIndex);

    } catch (err) {
        console.error('Error initializing video player:', err);
    }
}


function showVideo(index) {
    const videoPlayer = document.getElementById('randomVideoPlayer');
    const container   = document.getElementById('videoContainer');
    const videoName   = videosData[index].name;

    videoPlayer.src = `VID/${videoName}`;
    container.style.display = 'block';
    videoPlayer.style.display = 'block';


}



function showVideoPlayer() {
    showVideo(currentIndex);
}

function hideVideoPlayer() {
    const videoPlayer = document.getElementById('randomVideoPlayer');
    const container   = document.getElementById('videoContainer');
    
    videoPlayer.pause();
    videoPlayer.style.display = 'none';
    container.style.display = 'none';
}


function adjustVideoSize() {
    const videoPlayer = document.getElementById('randomVideoPlayer');
    const container   = document.getElementById('videoContainer');
    const fgImage     = document.querySelector('.foreground-layer-1 img');
    const screenW     = window.innerWidth;
    const aspectRatio = videoPlayer.videoWidth && videoPlayer.videoHeight
                        ? (videoPlayer.videoWidth / videoPlayer.videoHeight)
                        : (16 / 9);

    let widthPx, heightPx;

    if (screenW <= 460) {
        widthPx  = screenW * 0.9;
        heightPx = widthPx / aspectRatio;
    } else if (screenW <= 600) {
        const fgRect = fgImage.getBoundingClientRect();
        const heightAllowed = fgRect.height + 10;
        widthPx  = heightAllowed * aspectRatio;
        if (widthPx > screenW) {
            widthPx  = screenW;
            heightPx = widthPx / aspectRatio;
        } else {
            heightPx = heightAllowed;
        }
    } else {
        widthPx = Math.min(screenW * 0.5, screenW);
        heightPx = widthPx / aspectRatio;
    }

    videoPlayer.style.width  = `${widthPx}px`;
    videoPlayer.style.height = `${heightPx}px`;
    container.style.width    = `${widthPx}px`;
    container.style.height   = `${heightPx}px`;
}

// click toggles play/pause
function togglePlayPause() {
    const videoPlayer = document.getElementById('randomVideoPlayer');
    if (videoPlayer.paused) {
        videoPlayer.play().catch(err => {
            console.warn('Playback Error:', err);
          });
    }
    else videoPlayer.pause();
}

document.addEventListener('DOMContentLoaded', () => {
    initVideoPlayer();
    const videoPlayer = document.getElementById('randomVideoPlayer');
    videoPlayer.addEventListener('click', togglePlayPause);
    window.addEventListener('resize', adjustVideoSize);
});
