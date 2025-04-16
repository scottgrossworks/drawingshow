class ParallaxScroller {
    constructor() {
        // DOM Elements
        this.foreground = document.querySelector('.foreground-layer-1');
        this.background = document.querySelector('.background-layer-0');
        
        // Constants
        this.SCROLL_MULTIPLIER = 2.0;  // Increased for faster transition
        this.MOBILE_BREAKPOINT = 768;
        this.OPACITY_TRIGGER_POINT = 10;  // Changed to 10vh from top
        
        // State
        this.lastScrollY = window.scrollY;
        this.currentTranslateY = 70;  // Start showing 30% from bottom
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
            300,  // Minimum scroll height in vh
            window.innerHeight * 3  // At least 3 viewport heights
        );
        document.body.style.minHeight = `${scrollHeight}px`;
        
        // Update total scroll for calculations
        this.totalScroll = document.body.scrollHeight - window.innerHeight;
    }

    onScroll() {
        if (this.rafId) return;  // Prevent multiple rAF calls
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
        if (!this.foreground || !this.background) return;
        
        const transform = `translateY(${this.currentTranslateY}vh)`;
        this.foreground.style.transform = transform;

        // Calculate opacity based on position
        const foregroundOpacity = this.currentTranslateY <= this.OPACITY_TRIGGER_POINT ? 
            Math.max(0, (this.OPACITY_TRIGGER_POINT - this.currentTranslateY) / this.OPACITY_TRIGGER_POINT) : 1;
        this.foreground.style.opacity = foregroundOpacity;

        // When foreground reaches trigger point, fade out background more quickly
        const backgroundOpacity = this.currentTranslateY <= this.OPACITY_TRIGGER_POINT ? 
            Math.max(0, this.currentTranslateY / this.OPACITY_TRIGGER_POINT) : 1;
        this.background.style.opacity = backgroundOpacity;
    }

    update() {
        const scrollPercent = window.scrollY / this.totalScroll;
        
        // Calculate new position with smooth interpolation
        const targetY = 70 - (scrollPercent * 170 * this.SCROLL_MULTIPLIER);
        const delta = targetY - this.currentTranslateY;
        
        // Smooth interpolation
        this.currentTranslateY += delta * 0.1;
        
        // Update DOM
        this.updateTransform();
        
        // Clear rAF flag
        this.rafId = null;
        
        // Continue animation if there's still movement
        if (Math.abs(delta) > 0.01) {
            this.rafId = requestAnimationFrame(this.update);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParallaxScroller();
});
