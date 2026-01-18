/**
 * Persistent Video Player Popup
 * Dos videos lado a lado con reproducción sincronizada
 * Mantiene persistencia entre páginas usando localStorage
 */

(function() {
    'use strict';

    const VIDEO_PLAYER_KEY = 'celula_video_player_state';
    
    // Detectar ruta base según la ubicación de la página
    const getBasePath = () => {
        const path = window.location.pathname;
        if (path.includes('/post/')) return '../';
        if (path.includes('/marketing/')) return '../';
        return '';
    };
    
    const basePath = getBasePath();
    
    const VIDEO_SOURCES = [
        {
            src: `${basePath}assets/video/Video_Promocional_Grupo_Musical_Celula_1.webm`,
            type: 'video/webm',
            title: 'Video Promocional 1'
        },
        {
            src: `${basePath}assets/video/Video_Promocional_Grupo_Musical_Celula_2.webm`,
            type: 'video/webm',
            title: 'Video Promocional 2'
        }
    ];

    class VideoPlayerPopup {
        constructor() {
            this.player = null;
            this.videoLeft = null;
            this.videoRight = null;
            this.activeVideo = 'left'; // 'left' or 'right'
            this.volume = 0.7;
            this.isMinimized = false;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            
            this.init();
        }

        init() {
            // Cargar estado previo si existe
            this.loadState();
            
            // Crear el reproductor
            this.createPlayer();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Verificar si debe mostrarse automáticamente
            if (this.shouldAutoShow()) {
                this.show();
            }
        }

        shouldAutoShow() {
            // Mostrar en la primera visita a cualquier página
            const hasShown = sessionStorage.getItem('video_player_shown');
            if (!hasShown) {
                sessionStorage.setItem('video_player_shown', 'true');
                return true;
            }
            return false;
        }

        createPlayer() {
            if (document.getElementById('celula-video-player')) return;

            const playerHTML = `
                <div id="celula-video-player" class="video-player-popup hidden" role="dialog" aria-label="Reproductor de video">
                    <div class="video-player-container">
                        <div class="video-player-header">
                            <span class="video-player-title">Videos Promocionales</span>
                            <div class="video-player-controls-header">
                                <button class="video-btn-minimize" aria-label="Minimizar" title="Minimizar">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M19 13H5v-2h14v2z"/>
                                    </svg>
                                </button>
                                <button class="video-btn-close" aria-label="Cerrar" title="Cerrar">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div class="video-player-dual-wrapper">
                            <!-- Video Izquierdo -->
                            <div class="video-player-item" data-video="left">
                                <div class="video-player-wrapper">
                                    <video 
                                        class="video-player-element video-left" 
                                        preload="metadata"
                                        playsinline
                                        loop
                                    >
                                        <source src="${VIDEO_SOURCES[0].src}" type="${VIDEO_SOURCES[0].type}">
                                        Tu navegador no soporta video.
                                    </video>
                                    
                                    <div class="video-player-overlay video-overlay-left">
                                        <button class="video-btn-play-large" data-video="left" aria-label="Reproducir">
                                            <svg viewBox="0 0 24 24" width="60" height="60" fill="currentColor">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </button>
                                    </div>

                                    <div class="video-player-loading video-loading-left">
                                        <div class="video-spinner"></div>
                                    </div>
                                    
                                    <div class="video-title-overlay">${VIDEO_SOURCES[0].title}</div>
                                </div>

                                <div class="video-player-controls">
                                    <button class="video-btn-play" data-video="left" aria-label="Reproducir/Pausar">
                                        <svg class="icon-play" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                        <svg class="icon-pause hidden" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                                        </svg>
                                    </button>

                                    <div class="video-progress-container">
                                        <div class="video-progress-bar" data-video="left">
                                            <div class="video-progress-played"></div>
                                            <div class="video-progress-buffered"></div>
                                        </div>
                                        <div class="video-time">
                                            <span class="video-time-current">0:00</span>
                                            <span class="video-time-separator">/</span>
                                            <span class="video-time-duration">0:00</span>
                                        </div>
                                    </div>

                                    <button class="video-btn-mute" data-video="left" aria-label="Silenciar/Activar sonido">
                                        <svg class="icon-volume" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                                        </svg>
                                        <svg class="icon-mute hidden" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                        </svg>
                                    </button>

                                    <button class="video-btn-fullscreen" data-video="left" aria-label="Pantalla completa">
                                        <svg class="icon-fullscreen" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Video Derecho -->
                            <div class="video-player-item" data-video="right">
                                <div class="video-player-wrapper">
                                    <video 
                                        class="video-player-element video-right" 
                                        preload="metadata"
                                        playsinline
                                        loop
                                    >
                                        <source src="${VIDEO_SOURCES[1].src}" type="${VIDEO_SOURCES[1].type}">
                                        Tu navegador no soporta video.
                                    </video>
                                    
                                    <div class="video-player-overlay video-overlay-right">
                                        <button class="video-btn-play-large" data-video="right" aria-label="Reproducir">
                                            <svg viewBox="0 0 24 24" width="60" height="60" fill="currentColor">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </button>
                                    </div>

                                    <div class="video-player-loading video-loading-right">
                                        <div class="video-spinner"></div>
                                    </div>
                                    
                                    <div class="video-title-overlay">${VIDEO_SOURCES[1].title}</div>
                                </div>

                                <div class="video-player-controls">
                                    <button class="video-btn-play" data-video="right" aria-label="Reproducir/Pausar">
                                        <svg class="icon-play" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                        <svg class="icon-pause hidden" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                                        </svg>
                                    </button>

                                    <div class="video-progress-container">
                                        <div class="video-progress-bar" data-video="right">
                                            <div class="video-progress-played"></div>
                                            <div class="video-progress-buffered"></div>
                                        </div>
                                        <div class="video-time">
                                            <span class="video-time-current">0:00</span>
                                            <span class="video-time-separator">/</span>
                                            <span class="video-time-duration">0:00</span>
                                        </div>
                                    </div>

                                    <button class="video-btn-mute" data-video="right" aria-label="Silenciar/Activar sonido">
                                        <svg class="icon-volume" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                                        </svg>
                                        <svg class="icon-mute hidden" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                        </svg>
                                    </button>

                                    <button class="video-btn-fullscreen" data-video="right" aria-label="Pantalla completa">
                                        <svg class="icon-fullscreen" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', playerHTML);
            
            this.player = document.getElementById('celula-video-player');
            this.videoLeft = this.player.querySelector('.video-left');
            this.videoRight = this.player.querySelector('.video-right');
            
            // Configurar volumen inicial
            this.videoLeft.volume = this.volume;
            this.videoRight.volume = this.volume;
            
            // El video derecho empieza en mute para no solaparse
            this.videoRight.muted = true;
        }

        setupEventListeners() {
            // Video Left events
            this.videoLeft.addEventListener('loadedmetadata', () => this.onLoadedMetadata('left'));
            this.videoLeft.addEventListener('timeupdate', () => this.onTimeUpdate('left'));
            this.videoLeft.addEventListener('progress', () => this.onProgress('left'));
            this.videoLeft.addEventListener('play', () => this.onPlay('left'));
            this.videoLeft.addEventListener('pause', () => this.onPause('left'));
            this.videoLeft.addEventListener('waiting', () => this.showLoading('left'));
            this.videoLeft.addEventListener('canplay', () => this.hideLoading('left'));
            this.videoLeft.addEventListener('error', (e) => this.onVideoError(e, 'left'));
            
            // Video Right events
            this.videoRight.addEventListener('loadedmetadata', () => this.onLoadedMetadata('right'));
            this.videoRight.addEventListener('timeupdate', () => this.onTimeUpdate('right'));
            this.videoRight.addEventListener('progress', () => this.onProgress('right'));
            this.videoRight.addEventListener('play', () => this.onPlay('right'));
            this.videoRight.addEventListener('pause', () => this.onPause('right'));
            this.videoRight.addEventListener('waiting', () => this.showLoading('right'));
            this.videoRight.addEventListener('canplay', () => this.hideLoading('right'));
            this.videoRight.addEventListener('error', (e) => this.onVideoError(e, 'right'));

            // Control buttons - Left
            const leftItem = this.player.querySelector('[data-video="left"]');
            leftItem.querySelector('.video-btn-play').addEventListener('click', () => this.togglePlay('left'));
            leftItem.querySelector('.video-btn-play-large').addEventListener('click', () => this.togglePlay('left'));
            leftItem.querySelector('.video-btn-mute').addEventListener('click', () => this.toggleMute('left'));
            leftItem.querySelector('.video-btn-fullscreen').addEventListener('click', () => this.toggleFullscreen('left'));
            leftItem.querySelector('.video-progress-bar').addEventListener('click', (e) => this.seek(e, 'left'));
            
            // Control buttons - Right
            const rightItem = this.player.querySelector('[data-video="right"]');
            rightItem.querySelector('.video-btn-play').addEventListener('click', () => this.togglePlay('right'));
            rightItem.querySelector('.video-btn-play-large').addEventListener('click', () => this.togglePlay('right'));
            rightItem.querySelector('.video-btn-mute').addEventListener('click', () => this.toggleMute('right'));
            rightItem.querySelector('.video-btn-fullscreen').addEventListener('click', () => this.toggleFullscreen('right'));
            rightItem.querySelector('.video-progress-bar').addEventListener('click', (e) => this.seek(e, 'right'));

            // Header controls
            this.player.querySelector('.video-btn-minimize').addEventListener('click', () => this.minimize());
            this.player.querySelector('.video-btn-close').addEventListener('click', () => this.hide());

            // Dragging
            const header = this.player.querySelector('.video-player-header');
            header.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.stopDrag());

            // Guardar estado antes de cambiar de página
            window.addEventListener('beforeunload', () => this.saveState());
        }

        // Video control methods
        togglePlay(side) {
            const video = side === 'left' ? this.videoLeft : this.videoRight;
            const otherVideo = side === 'left' ? this.videoRight : this.videoLeft;
            
            if (video.paused) {
                // Pausar el otro video y mutearlo
                otherVideo.pause();
                otherVideo.muted = true;
                
                // Reproducir este video y activar audio
                video.muted = false;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.warn('Auto-play prevented:', error);
                    });
                }
                
                this.activeVideo = side;
            } else {
                video.pause();
            }
            
            this.updatePlayIcon(side);
            this.updateMuteIcon(side);
            this.updateMuteIcon(side === 'left' ? 'right' : 'left');
        }

        toggleMute(side) {
            const video = side === 'left' ? this.videoLeft : this.videoRight;
            const otherVideo = side === 'left' ? this.videoRight : this.videoLeft;
            
            if (!video.muted) {
                // Mutear este video
                video.muted = true;
            } else {
                // Desmutear este video y mutear el otro
                video.muted = false;
                otherVideo.muted = true;
                this.activeVideo = side;
                this.updateMuteIcon(side === 'left' ? 'right' : 'left');
            }
            
            this.updateMuteIcon(side);
        }

        toggleFullscreen(side) {
            const videoItem = this.player.querySelector(`[data-video="${side}"]`);
            const wrapper = videoItem.querySelector('.video-player-wrapper');
            
            if (!document.fullscreenElement) {
                if (wrapper.requestFullscreen) {
                    wrapper.requestFullscreen();
                } else if (wrapper.webkitRequestFullscreen) {
                    wrapper.webkitRequestFullscreen();
                } else if (wrapper.mozRequestFullScreen) {
                    wrapper.mozRequestFullScreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
            }
        }

        seek(event, side) {
            const progressBar = event.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const pos = (event.clientX - rect.left) / rect.width;
            const video = side === 'left' ? this.videoLeft : this.videoRight;
            video.currentTime = pos * video.duration;
        }

        // Event handlers
        onLoadedMetadata(side) {
            this.updateDuration(side);
        }

        onTimeUpdate(side) {
            this.updateProgress(side);
            this.updateTimeDisplay(side);
        }

        onProgress(side) {
            this.updateBuffered(side);
        }

        onPlay(side) {
            this.updatePlayIcon(side);
            this.hideOverlay(side);
        }

        onPause(side) {
            this.updatePlayIcon(side);
            this.showOverlay(side);
        }

        onVideoError(event, side) {
            console.error(`Video error (${side}):`, event);
            const video = side === 'left' ? this.videoLeft : this.videoRight;
            console.error('Error details:', {
                error: video.error,
                networkState: video.networkState,
                readyState: video.readyState,
                src: video.currentSrc
            });
        }

        // UI update methods
        updatePlayIcon(side) {
            const video = side === 'left' ? this.videoLeft : this.videoRight;
            const videoItem = this.player.querySelector(`[data-video="${side}"]`);
            const playIcon = videoItem.querySelector('.icon-play');
            const pauseIcon = videoItem.querySelector('.icon-pause');
            
            if (!video.paused) {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        }

        updateMuteIcon(side) {
            const video = side === 'left' ? this.videoLeft : this.videoRight;
            const videoItem = this.player.querySelector(`[data-video="${side}"]`);
            const volumeIcon = videoItem.querySelector('.icon-volume');
            const muteIcon = videoItem.querySelector('.icon-mute');
            
            if (video.muted) {
                volumeIcon.classList.add('hidden');
                muteIcon.classList.remove('hidden');
            } else {
                volumeIcon.classList.remove('hidden');
                muteIcon.classList.add('hidden');
            }
        }

        updateProgress(side) {
            const video = side === 'left' ? this.videoLeft : this.videoRight;
            const videoItem = this.player.querySelector(`[data-video="${side}"]`);
            const progress = (video.currentTime / video.duration) * 100;
            videoItem.querySelector('.video-progress-played').style.width = progress + '%';
        }

        updateBuffered(side) {
            const video = side === 'left' ? this.videoLeft : this.videoRight;
            const videoItem = this.player.querySelector(`[data-video="${side}"]`);
            
            if (video.buffered.length > 0) {
                const buffered = (video.buffered.end(0) / video.duration) * 100;
                videoItem.querySelector('.video-progress-buffered').style.width = buffered + '%';
            }
        }

        updateTimeDisplay(side) {
            const video = side === 'left' ? this.videoLeft : this.videoRight;
            const videoItem = this.player.querySelector(`[data-video="${side}"]`);
            const current = this.formatTime(video.currentTime);
            videoItem.querySelector('.video-time-current').textContent = current;
        }

        updateDuration(side) {
            const video = side === 'left' ? this.videoLeft : this.videoRight;
            const videoItem = this.player.querySelector(`[data-video="${side}"]`);
            const duration = this.formatTime(video.duration);
            videoItem.querySelector('.video-time-duration').textContent = duration;
        }

        formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        showOverlay(side) {
            const overlay = this.player.querySelector(`.video-overlay-${side}`);
            overlay.classList.add('visible');
        }

        hideOverlay(side) {
            const overlay = this.player.querySelector(`.video-overlay-${side}`);
            overlay.classList.remove('visible');
        }

        showLoading(side) {
            const loading = this.player.querySelector(`.video-loading-${side}`);
            loading.classList.add('visible');
        }

        hideLoading(side) {
            const loading = this.player.querySelector(`.video-loading-${side}`);
            loading.classList.remove('visible');
        }

        // Dragging functionality
        startDrag(event) {
            if (event.target.closest('.video-btn-minimize') || event.target.closest('.video-btn-close')) {
                return;
            }
            
            this.isDragging = true;
            const rect = this.player.getBoundingClientRect();
            this.dragOffset = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            this.player.style.transition = 'none';
        }

        drag(event) {
            if (!this.isDragging) return;
            
            event.preventDefault();
            const x = event.clientX - this.dragOffset.x;
            const y = event.clientY - this.dragOffset.y;
            
            this.player.style.left = x + 'px';
            this.player.style.top = y + 'px';
            this.player.style.right = 'auto';
            this.player.style.bottom = 'auto';
        }

        stopDrag() {
            if (this.isDragging) {
                this.isDragging = false;
                this.player.style.transition = '';
            }
        }

        // Window management
        minimize() {
            this.isMinimized = !this.isMinimized;
            this.player.classList.toggle('minimized', this.isMinimized);
            this.saveState();
        }

        show() {
            this.player.classList.remove('hidden');
            this.saveState();
        }

        hide() {
            this.player.classList.add('hidden');
            this.videoLeft.pause();
            this.videoRight.pause();
            this.saveState();
        }

        // State persistence
        saveState() {
            const state = {
                activeVideo: this.activeVideo,
                leftTime: this.videoLeft.currentTime,
                rightTime: this.videoRight.currentTime,
                volume: this.volume,
                leftPlaying: !this.videoLeft.paused,
                rightPlaying: !this.videoRight.paused,
                leftMuted: this.videoLeft.muted,
                rightMuted: this.videoRight.muted,
                isMinimized: this.isMinimized,
                isHidden: this.player.classList.contains('hidden'),
                position: {
                    left: this.player.style.left,
                    top: this.player.style.top
                }
            };
            
            localStorage.setItem(VIDEO_PLAYER_KEY, JSON.stringify(state));
        }

        loadState() {
            const stateStr = localStorage.getItem(VIDEO_PLAYER_KEY);
            if (!stateStr) return;
            
            try {
                const state = JSON.parse(stateStr);
                this.activeVideo = state.activeVideo || 'left';
                this.volume = state.volume || 0.7;
                this.isMinimized = state.isMinimized || false;
                
                // Restaurar posición si existe
                if (state.position && state.position.left && state.position.top) {
                    setTimeout(() => {
                        this.player.style.left = state.position.left;
                        this.player.style.top = state.position.top;
                        this.player.style.right = 'auto';
                        this.player.style.bottom = 'auto';
                    }, 0);
                }
            } catch (e) {
                console.warn('Error loading video player state:', e);
            }
        }
    }

    // Initialize player when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.celulaVideoPlayer = new VideoPlayerPopup();
        });
    } else {
        window.celulaVideoPlayer = new VideoPlayerPopup();
    }

})();
