// video_player.js - Video player functionality

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

        // Start with a random index
        currentIndex = Math.floor(Math.random() * videosData.length);

        // Wire nav buttons
        document.getElementById('prevBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + videosData.length) % videosData.length;
            showVideo(currentIndex);
        });
        
        document.getElementById('nextBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % videosData.length;
            showVideo(currentIndex);
        });

        // Volume button functionality
        const volumeBtn = document.getElementById('volumeBtn');
        const videoPlayer = document.getElementById('randomVideoPlayer');
        
        volumeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            videoPlayer.muted = !videoPlayer.muted;
            if (videoPlayer.muted) {
                volumeBtn.classList.remove('unmuted');
            } else {
                volumeBtn.classList.add('unmuted');
            }
        });

        // Play/pause on video click
        videoPlayer.addEventListener('click', () => {
            if (videoPlayer.paused) {
                videoPlayer.play().catch(err => {
                    console.warn('Playback Error:', err);
                });
            } else {
                videoPlayer.pause();
            }
        });


        // Play next video automatically when current video ends
        videoPlayer.addEventListener('ended', () => {
        currentIndex = (currentIndex + 1) % videosData.length;
        showVideo(currentIndex);
        });


        // Handle video loaded metadata
        videoPlayer.addEventListener('loadedmetadata', adjustVideoSize);
        


        showVideo(currentIndex);
    } catch (err) {
        console.error('Error initializing video player:', err);
    }
}



function showVideo(index) {
    const videoPlayer = document.getElementById('randomVideoPlayer');
    const container = document.getElementById('videoContainer');
    const videoName = videosData[index].name;

    videoPlayer.src = `VID/${videoName}`;
    
    // Replace the existing container.style.display line with:
    container.style.display = 'block';
    // Add a small delay before setting opacity to ensure display: block has taken effect
    setTimeout(() => {
        container.style.opacity = '1';
    }, 50);
    
    videoPlayer.load();
    videoPlayer.play().catch(err => {
        console.warn('Autoplay Error:', err);
    });
}



function adjustVideoSize() {
    const videoContainer = document.getElementById('videoContainer');
    const videoPlayer = document.getElementById('randomVideoPlayer');
    
    if (!videoPlayer.videoWidth || !videoPlayer.videoHeight) return;
    
    const aspectRatio = videoPlayer.videoWidth / videoPlayer.videoHeight;
    const containerWidth = videoContainer.clientWidth;
    const calculatedHeight = containerWidth / aspectRatio;
    
    videoPlayer.style.height = `${calculatedHeight}px`;
}

// Listen for window resize
window.addEventListener('resize', adjustVideoSize);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initVideoPlayer);


// Add user interaction to enable sound
document.addEventListener('click', function() {
    const video = document.querySelector('video');
    video.muted = false;
});

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('randomVideoPlayer');
    const loadingOverlay = document.getElementById('loadingOverlay');



    // Hide loading overlay when video can play
    video.addEventListener('canplay', function() {
        loadingOverlay.style.display = 'none';
    });

    // Also handle errors
    video.addEventListener('error', function() {
        loadingOverlay.style.display = 'none';
    });

});