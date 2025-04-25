// scroll_animation.js - Parallax scrolling functionality

class ParallaxScroller {
    constructor() {
        this.foregroundContainer = document.querySelector('.layer-foreground-container');

        this.layerBackground = document.querySelector('.layer-background');
        this.videoPlayer = document.querySelector('.layer-video');

        this.header = document.querySelector('.layer-header');

        if (!this.foregroundContainer || !this.header) {
            console.error('ParallaxScroller: Required elements not found.');
            return;
        }

        this.START_VH = 75;
        this.END_VH = 25;
        this.FADE_START = 65; // Start fading earlier (higher value = starts lower on the page)
        this.FADE_END = 40;   // End fading earlier (higher value = ends lower on the page)

        this.windowHeight = window.innerHeight;
        this.rafId = null;

        this.update = this.update.bind(this);

        this.foregroundContainer.style.height = '25vh';
        this.foregroundContainer.style.transform = `translateY(${this.START_VH}vh)`;
        this.header.style.transition = 'opacity 0.2s linear';

        document.body.style.minHeight = '200vh';

        window.addEventListener('scroll', () => {
            if (this.rafId) return;
            this.rafId = requestAnimationFrame(this.update);
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.windowHeight = window.innerHeight;
            this.update();
        }, { passive: true });

        // Initial update
        this.update();
    }

    update() {
        const scrollY = window.scrollY;
        const maxScroll = (this.START_VH - this.END_VH) / 100 * this.windowHeight;
        const scrollPercent = Math.max(0, Math.min(scrollY / maxScroll, 1));
        const foregroundY = this.START_VH + (this.END_VH - this.START_VH) * scrollPercent;
        this.foregroundContainer.style.transform = `translateY(${foregroundY}vh)`;

        // Debug output
        // console.log(`scrollY: ${scrollY}, foregroundY: ${foregroundY}`);

        let headerOpacity = 1;
        
        this.layerBackground.style.opacity = 1;
        this.videoPlayer.style.opacity = 1;

        if (foregroundY <= this.FADE_END) {
            headerOpacity = 0;

            // ALSO DISAPPEAR THE VIDEO AND BACKGROUND
            this.layerBackground.style.opacity = 0;
            this.videoPlayer.style.opacity = 0;


        } else if (foregroundY < this.FADE_START) {
            headerOpacity = (foregroundY - this.FADE_END) / (this.FADE_START - this.FADE_END);
        }
        this.header.style.opacity = headerOpacity;

        // Debug output
        // console.log(`headerOpacity: ${headerOpacity}`);

        this.rafId = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParallaxScroller();

    // Footer show/hide on scroll
    const footer = document.getElementById('pageFooter');
    window.addEventListener('scroll', () => {
        // Check if user is at the bottom
        const atBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2);
        if (atBottom) {
            footer.classList.add('visible');
        } else {
            footer.classList.remove('visible');
        }
    });
});