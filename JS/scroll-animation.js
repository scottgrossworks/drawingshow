class ParallaxScroller {
    constructor() {
        // DOM Elements
        this.foreground = document.querySelector('.foreground-layer-1');
        this.background = document.querySelector('.background-layer-0');
        this.header = document.querySelector('.header');  
        this.blackOverlay = document.querySelector('.black-overlay');
        
        // Constants
        this.SCROLL_MULTIPLIER = 2.0;  
        this.MOBILE_BREAKPOINT = 768;
        this.HEADER_FADE_START = 20;      // Start fading header at 20vh
        this.BLACK_OVERLAY_TRIGGER = 30;  // Show black overlay when foreground is 30vh from top
        
        // State
        this.lastScrollY = window.scrollY;
        this.currentTranslateY = 70;  
        this.blackOverlayY = 90;      
        this.isResizing = false;
        this.rafId = null;
        this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;

        // Bind methods
        this.onScroll = this.onScroll.bind(this);
        this.onResize = this.onResize.bind(this);
        this.update = this.update.bind(this);
        
        // Initialize
        this.init();
    }

    init() {
        // Set initial position
        this.updateTransform();
        
        // Event listeners
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onResize, { passive: true });
        
        // Initial setup
        this.setupScrollHeight();
    }

    setupScrollHeight() {
        // Calculate total scroll height based on animation needs
        const scrollHeight = Math.max(
            300,  
            window.innerHeight * 3  
        );
        document.body.style.minHeight = `${scrollHeight}px`;
        
        // Update total scroll for calculations
        this.totalScroll = document.body.scrollHeight - window.innerHeight;
    }

    onScroll() {
        if (this.rafId) return;  
        this.rafId = requestAnimationFrame(this.update);
    }

    onResize() {
        if (this.isResizing) return;
        this.isResizing = true;

        // Debounce resize handling
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;
            this.setupScrollHeight();
            this.update();
            this.isResizing = false;
        }, 250);
    }

    updateTransform() {
        if (!this.foreground) return;
        
        const transform = `translateY(${this.currentTranslateY}vh)`;
        this.foreground.style.transform = transform;

        // Update black overlay position independently
        if (this.blackOverlay) {
            if (this.currentTranslateY <= 0) {
                // When foreground is at top, keep black overlay at top
                this.blackOverlay.style.transform = 'translateY(0)';
            } else {
                // Otherwise move black overlay based on its own position
                const blackOverlayTransform = `translateY(${this.blackOverlayY}vh)`;
                this.blackOverlay.style.transform = blackOverlayTransform;
            }
        }

        // Calculate header opacity
        if (this.header) {
            let headerOpacity = 1;
            if (this.currentTranslateY <= this.HEADER_FADE_START) {
                headerOpacity = Math.max(0, this.currentTranslateY / this.HEADER_FADE_START);
            }
            this.header.style.opacity = headerOpacity;
        }
    }

    update() {
        const scrollPercent = window.scrollY / this.totalScroll;
        
        // Calculate new position for foreground
        const targetY = 70 - (scrollPercent * 170 * this.SCROLL_MULTIPLIER);
        const delta = targetY - this.currentTranslateY;
        this.currentTranslateY += delta * 0.1;

        // Calculate new position for black overlay
        const blackOverlayTarget = 90 - (scrollPercent * 170 * this.SCROLL_MULTIPLIER);
        const blackOverlayDelta = blackOverlayTarget - this.blackOverlayY;
        this.blackOverlayY += blackOverlayDelta * 0.1;
        
        // Update transforms
        this.updateTransform();
        
        // Clear rAF flag
        this.rafId = null;
        
        // Continue animation if there's still movement
        if (Math.abs(delta) > 0.01 || Math.abs(blackOverlayDelta) > 0.01) {
            this.rafId = requestAnimationFrame(this.update);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParallaxScroller();
});
