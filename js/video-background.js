/**
 * Grupo Musical Célula - Persistent Video Background Module
 * Componente para video de fondo persistente entre sesiones y páginas
 */

class PersistentVideoBackground {
    constructor(options = {}) {
        this.options = {
            videoBaseName: options.videoBaseName || 'assets/video/background-video',
            fallbackImage: options.fallbackImage || 'assets/images/hero-background.webp',
            selector: options.selector || '.persistent-video-bg',
            mobileBreakpoint: options.mobileBreakpoint || 768,
            tabletBreakpoint: options.tabletBreakpoint || 1024,
            volume: options.volume || 0,
            loop: options.loop !== false,
            muted: options.muted !== false,
            overlayColor: options.overlayColor || 'rgba(0, 0, 0, 0.5)',
            ...options
        };
        
        this.videoElement = null;
        this.container = null;
        this.isMobile = this.checkIsMobile();
        this.isVisible = true;

        this.init();
    }

    getVideoSrc() {
        const width = window.innerWidth;
        if (width <= this.options.mobileBreakpoint) {
            return `${this.options.videoBaseName}-480p.mp4`;
        } else if (width <= this.options.tabletBreakpoint) {
            return `${this.options.videoBaseName}-720p.mp4`;
        } else {
            return `${this.options.videoBaseName}-1080p.mp4`;
        }
    }

    normalizePath(path) {
        const currentPath = window.location.pathname;
        const pathParts = currentPath.substring(1).split('/');

        // If we're on the root, return the path as is
        if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === '')) {
            return path;
        }

        // Count how many directory levels we're in
        let depth = pathParts.length - 1;

        // If we're on a file (like blog.html), subtract one more
        if (pathParts[pathParts.length - 1].includes('.')) {
            depth--;
        }

        // Build relative path prefix
        let prefix = '';
        for (let i = 0; i < depth; i++) {
            prefix += '../';
        }

        return prefix + path;
    }
    
    checkIsMobile() {
        return window.innerWidth <= this.options.mobileBreakpoint || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    init() {
        this.createVideoBackground();
        this.setupEventListeners();
        this.applyVideoBackground();
    }
    
    createVideoBackground() {
        this.container = document.createElement('div');
        this.container.className = 'persistent-video-container';
        
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.muted = this.options.muted;
        this.videoElement.loop = this.options.loop;
        this.videoElement.playsInline = true;
        this.videoElement.preload = 'auto';
        this.videoElement.volume = this.options.volume;
        this.videoElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1000;';
        
        const sourceElement = document.createElement('source');
        sourceElement.src = this.getVideoSrc(); // Use the new method to get the initial source
        sourceElement.type = 'video/mp4';
        
        this.videoElement.appendChild(sourceElement);
        
        const overlay = document.createElement('div');
        overlay.className = 'persistent-video-overlay';
        
        this.container.appendChild(this.videoElement);
        this.container.appendChild(overlay);
        
        if (document.body.firstChild) {
            document.body.insertBefore(this.container, document.body.firstChild);
        } else {
            document.body.appendChild(this.container);
        }
        
        this.addStyles();
        
        console.log('Responsive video background created with initial src:', sourceElement.src);
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.id = 'persistent-video-bg-styles';
        style.textContent = `
            .persistent-video-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 0;
                overflow: hidden;
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
                pointer-events: none;
            }
            
            .persistent-video-container.active {
                opacity: 1;
            }
            
            .persistent-video-container video {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                object-fit: cover;
                object-position: center;
                will-change: transform;
                pointer-events: none;
            }
            
            .persistent-video-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${this.options.overlayColor || 'rgba(0, 0, 0, 0.5)'};
                z-index: 2;
                pointer-events: none;
            }

            .hero-section,
            .content-section,
            .banda-section,
            .videos-section,
            .site-container {
                background: transparent !important;
                position: relative;
                z-index: 10;
            }
            
            header, nav, .site-header {
                z-index: 100 !important;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newSrc = this.getVideoSrc();
                if (this.videoElement.querySelector('source').src !== newSrc) {
                    this.updateVideoSource(newSrc);
                }
            }, 250); // Debounce resize event
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseVideo();
            } else if (this.isVisible) {
                this.playVideo();
            }
        });
    }
    
    applyVideoBackground() {
        this.container.classList.add('active');
        this.playVideo();
    }

    playVideo() {
        if (this.videoElement) {
            const playPromise = this.videoElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.warn('Video playback prevented:', e);
                    this.setupPlayOnInteraction();
                });
            }
        }
    }
    
    pauseVideo() {
        if (this.videoElement) {
            this.videoElement.pause();
        }
    }
    
    setupPlayOnInteraction() {
        const playOnInteraction = () => {
            this.videoElement.play().catch(e => console.warn('Still cannot play video:', e));
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
    }
    
    updateVideoSource(newSrc) {
        if (this.videoElement && this.videoElement.querySelector('source').src !== window.location.origin + newSrc) {
            console.log(`Updating video source to: ${newSrc}`);
            this.videoElement.querySelector('source').src = newSrc;
            this.videoElement.load();
            this.playVideo();
        }
    }
    
    destroy() {
        if (this.container) {
            this.container.remove();
        }
        const styles = document.getElementById('persistent-video-bg-styles');
        if (styles) {
            styles.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const videoBgConfig = {
        videoBaseName: 'assets/video/background-video', // Base name for the video files
        fallbackImage: 'assets/images/hero-background.webp',
        mobileBreakpoint: 768,
        tabletBreakpoint: 1024,
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        muted: true,
        loop: true
    };
    
    if (!document.querySelector('.persistent-video-container')) {
        window.CelulaVideoBackground = new PersistentVideoBackground(videoBgConfig);
    }
    
    window.PersistentVideoBackgroundClass = PersistentVideoBackground;
});

// Also initialize when the page is loaded to ensure all resources are available
window.addEventListener('load', function() {
    if (window.CelulaVideoBackground) {
        // Try to play the video again once everything is loaded
        setTimeout(() => {
            window.CelulaVideoBackground.playVideo();
        }, 500);
    }
});