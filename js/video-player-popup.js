/**
 * Persistent Video Player Popup
 * Dos reproductores independientes: uno a la izquierda, otro a la derecha
 * Mantiene persistencia entre páginas usando localStorage
 */

(function() {
    'use strict';

    const VIDEO_PLAYER_KEY = 'celula_video_players_state';
    
    // Detectar ruta base según la ubicación de la página
    const getBasePath = () => {
        const path = window.location.pathname;
        if (path.includes('/post/')) return '../';
        if (path.includes('/marketing/')) return '../';
        return '';
    };
    
    const basePath = getBasePath();
    
    const VIDEO_CONFIGS = {
        left: {
            src: `${basePath}assets/video/Video_Promocional_Grupo_Musical_Celula_1.webm`,
            type: 'video/webm',
            title: 'Video Promocional 1',
            position: 'left'
        },
        right: {
            src: `${basePath}assets/video/Video_Promocional_Grupo_Musical_Celula_2.webm`,
            type: 'video/webm',
            title: 'Video Promocional 2',
            position: 'right'
        }
    };

    class SingleVideoPlayer {
        constructor(config, side) {
            this.config = config;
            this.side = side;
            this.player = null;
            this.videoElement = null;
            this.volume = 0.7;
            this.isMinimized = false;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            
            this.createPlayer();
            this.setupEventListeners();
        }

        createPlayer() {
            const playerId = `celula-video-player-${this.side}`;
            if (document.getElementById(playerId)) return;

            const playerHTML = `
                <div id="${playerId}" class="video-player-single video-player-${this.side} hidden" role="dialog" aria-label="Reproductor de video">
                    <div class="video-player-container">
                        <button class="video-btn-close-compact" aria-label="Cerrar" title="Cerrar">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                        
                        <div class="video-player-wrapper">
                            <video 
                                class="video-player-element" 
                                preload="metadata"
                                playsinline
                                loop
                            >
                                <source src="${this.config.src}" type="${this.config.type}">
                                Tu navegador no soporta video.
                            </video>
                            
                            <div class="video-player-overlay">
                                <button class="video-btn-play-large" aria-label="Reproducir">
                                    <svg viewBox="0 0 24 24" width="50" height="50" fill="currentColor">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </button>
                            </div>

                            <div class="video-player-loading">
                                <div class="video-spinner"></div>
                            </div>
                        </div>

                        <div class="video-player-controls">
                            <button class="video-btn-play" aria-label="Reproducir/Pausar">
                                <svg class="icon-play" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                <svg class="icon-pause hidden" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                                </svg>
                            </button>

                            <div class="video-progress-container">
                                <div class="video-progress-bar">
                                    <div class="video-progress-played"></div>
                                    <div class="video-progress-buffered"></div>
                                </div>
                                <div class="video-time">
                                    <span class="video-time-current">0:00</span>
                                    <span class="video-time-separator">/</span>
                                    <span class="video-time-duration">0:00</span>
                                </div>
                            </div>

                            <button class="video-btn-mute" aria-label="Silenciar/Activar sonido">
                                <svg class="icon-volume" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                                </svg>
                                <svg class="icon-mute hidden" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                </svg>
                            </button>

                            <button class="video-btn-fullscreen" aria-label="Pantalla completa">
                                <svg class="icon-fullscreen" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', playerHTML);
            
            this.player = document.getElementById(playerId);
            this.videoElement = this.player.querySelector('.video-player-element');
            
            // Configurar volumen inicial
            this.videoElement.volume = this.volume;
        }

        setupEventListeners() {
            const video = this.videoElement;
            
            // Video events
            video.addEventListener('loadedmetadata', () => this.updateDuration());
            video.addEventListener('timeupdate', () => {
                this.updateProgress();
                this.updateTimeDisplay();
            });
            video.addEventListener('progress', () => this.updateBuffered());
            video.addEventListener('play', () => {
                this.updatePlayIcon();
                this.hideOverlay();
                this.notifyOtherPlayer('playing');
            });
            video.addEventListener('pause', () => {
                this.updatePlayIcon();
                this.showOverlay();
            });
            video.addEventListener('waiting', () => this.showLoading());
            video.addEventListener('canplay', () => this.hideLoading());
            video.addEventListener('error', (e) => this.onVideoError(e));
            video.addEventListener('ended', () => this.onVideoEnded());

            // Control buttons
            this.player.querySelector('.video-btn-play').addEventListener('click', () => this.togglePlay());
            this.player.querySelector('.video-btn-play-large').addEventListener('click', () => this.togglePlay());
            this.player.querySelector('.video-btn-mute').addEventListener('click', () => this.toggleMute());
            this.player.querySelector('.video-btn-fullscreen').addEventListener('click', () => this.toggleFullscreen());
            this.player.querySelector('.video-btn-close-compact').addEventListener('click', () => this.hide());

            // Click en el video para toggle play/pause
            this.videoElement.addEventListener('click', () => this.togglePlay());

            // Progress bar
            this.player.querySelector('.video-progress-bar').addEventListener('click', (e) => this.seek(e));

            // Dragging - usar el contenedor completo
            const container = this.player.querySelector('.video-player-container');
            container.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.stopDrag());
        }

        notifyOtherPlayer(action) {
            const otherSide = this.side === 'left' ? 'right' : 'left';
            const otherPlayer = window.celulaVideoPlayers && window.celulaVideoPlayers[otherSide];
            
            if (!otherPlayer) return;
            
            if (action === 'playing') {
                // Pausar el otro video cuando este empiece a reproducir
                otherPlayer.pause();
                otherPlayer.mute();
            }
        }

        togglePlay() {
            if (this.videoElement.paused) {
                this.play();
            } else {
                this.pause();
            }
        }

        play() {
            const playPromise = this.videoElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Auto-play prevented (${this.side}):`, error);
                });
            }
        }

        pause() {
            this.videoElement.pause();
        }

        toggleMute() {
            this.videoElement.muted = !this.videoElement.muted;
            this.updateMuteIcon();
            
            // Si se desmutea este, mutear el otro y reproducir este video
            if (!this.videoElement.muted) {
                this.notifyOtherPlayer('unmute');
                
                // Si el video está pausado, reproducirlo
                if (this.videoElement.paused) {
                    this.play();
                }
            }
        }

        mute() {
            this.videoElement.muted = true;
            this.updateMuteIcon();
        }

        toggleFullscreen() {
            const wrapper = this.player.querySelector('.video-player-wrapper');
            
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
                }
            }
        }

        seek(event) {
            const progressBar = event.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const pos = (event.clientX - rect.left) / rect.width;
            this.videoElement.currentTime = pos * this.videoElement.duration;
        }

        onVideoEnded() {
            // En móviles, reproducir el otro video al finalizar
            if (window.innerWidth <= 768) {
                const otherSide = this.side === 'left' ? 'right' : 'left';
                const otherPlayer = window.celulaVideoPlayers && window.celulaVideoPlayers[otherSide];
                
                if (otherPlayer) {
                    // Pausar este video
                    this.pause();
                    this.mute();
                    
                    // Reproducir el otro con audio
                    otherPlayer.videoElement.muted = false;
                    otherPlayer.play();
                    otherPlayer.updateMuteIcon();
                }
            }
        }

        onVideoError(event) {
            console.error(`Video error (${this.side}):`, event);
            console.error('Error details:', {
                error: this.videoElement.error,
                networkState: this.videoElement.networkState,
                readyState: this.videoElement.readyState,
                src: this.videoElement.currentSrc
            });
        }

        // UI update methods
        updatePlayIcon() {
            const playIcon = this.player.querySelector('.icon-play');
            const pauseIcon = this.player.querySelector('.icon-pause');
            
            if (!this.videoElement.paused) {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        }

        updateMuteIcon() {
            const volumeIcon = this.player.querySelector('.icon-volume');
            const muteIcon = this.player.querySelector('.icon-mute');
            
            if (this.videoElement.muted) {
                volumeIcon.classList.add('hidden');
                muteIcon.classList.remove('hidden');
            } else {
                volumeIcon.classList.remove('hidden');
                muteIcon.classList.add('hidden');
            }
        }

        updateProgress() {
            const progress = (this.videoElement.currentTime / this.videoElement.duration) * 100;
            this.player.querySelector('.video-progress-played').style.width = progress + '%';
        }

        updateBuffered() {
            if (this.videoElement.buffered.length > 0) {
                const buffered = (this.videoElement.buffered.end(0) / this.videoElement.duration) * 100;
                this.player.querySelector('.video-progress-buffered').style.width = buffered + '%';
            }
        }

        updateTimeDisplay() {
            const current = this.formatTime(this.videoElement.currentTime);
            this.player.querySelector('.video-time-current').textContent = current;
        }

        updateDuration() {
            const duration = this.formatTime(this.videoElement.duration);
            this.player.querySelector('.video-time-duration').textContent = duration;
        }

        formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        showOverlay() {
            this.player.querySelector('.video-player-overlay').classList.add('visible');
        }

        hideOverlay() {
            this.player.querySelector('.video-player-overlay').classList.remove('visible');
        }

        showLoading() {
            this.player.querySelector('.video-player-loading').classList.add('visible');
        }

        hideLoading() {
            this.player.querySelector('.video-player-loading').classList.remove('visible');
        }

        // Dragging functionality
        startDrag(event) {
            // No permitir drag si se está clickeando en botones o en el video
            if (event.target.closest('button') || 
                event.target.closest('video') || 
                event.target.closest('.video-progress-bar')) {
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
                this.saveState();
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
            this.videoElement.pause();
            this.saveState();
        }

        // State management
        getState() {
            return {
                currentTime: this.videoElement.currentTime,
                volume: this.videoElement.volume,
                muted: this.videoElement.muted,
                playing: !this.videoElement.paused,
                minimized: this.isMinimized,
                hidden: this.player.classList.contains('hidden'),
                position: {
                    left: this.player.style.left,
                    top: this.player.style.top,
                    right: this.player.style.right,
                    bottom: this.player.style.bottom
                }
            };
        }

        setState(state) {
            if (!state) return;
            
            try {
                this.volume = state.volume || 0.7;
                this.videoElement.volume = this.volume;
                this.videoElement.muted = state.muted !== undefined ? state.muted : true;
                this.isMinimized = state.minimized || false;
                
                if (this.isMinimized) {
                    this.player.classList.add('minimized');
                }
                
                if (state.hidden === false) {
                    this.player.classList.remove('hidden');
                }
                
                // Restaurar posición si fue movido manualmente
                if (state.position && state.position.left && state.position.top) {
                    setTimeout(() => {
                        this.player.style.left = state.position.left;
                        this.player.style.top = state.position.top;
                        this.player.style.right = state.position.right || 'auto';
                        this.player.style.bottom = state.position.bottom || 'auto';
                    }, 0);
                }
                
                this.updateMuteIcon();
            } catch (e) {
                console.warn(`Error loading state for ${this.side} player:`, e);
            }
        }

        saveState() {
            const allStates = JSON.parse(localStorage.getItem(VIDEO_PLAYER_KEY) || '{}');
            allStates[this.side] = this.getState();
            localStorage.setItem(VIDEO_PLAYER_KEY, JSON.stringify(allStates));
        }

        loadState() {
            const allStates = JSON.parse(localStorage.getItem(VIDEO_PLAYER_KEY) || '{}');
            return allStates[this.side];
        }
    }

    class DualVideoPlayerManager {
        constructor() {
            this.players = {};
            this.init();
        }

        init() {
            // Crear ambos reproductores
            this.players.left = new SingleVideoPlayer(VIDEO_CONFIGS.left, 'left');
            this.players.right = new SingleVideoPlayer(VIDEO_CONFIGS.right, 'right');
            
            // Cargar estados previos
            const savedStates = JSON.parse(localStorage.getItem(VIDEO_PLAYER_KEY) || '{}');
            
            if (savedStates.left) {
                this.players.left.setState(savedStates.left);
            }
            
            if (savedStates.right) {
                this.players.right.setState(savedStates.right);
            }
            
            // Verificar si debe mostrarse automáticamente
            if (this.shouldAutoShow()) {
                this.players.left.show();
                this.players.right.show();
                // Mutear el video derecho por defecto
                this.players.right.mute();
            }
            
            // Guardar estado antes de cambiar de página
            window.addEventListener('beforeunload', () => {
                this.players.left.saveState();
                this.players.right.saveState();
            });
        }

        shouldAutoShow() {
            const hasShown = sessionStorage.getItem('video_players_shown');
            if (!hasShown) {
                sessionStorage.setItem('video_players_shown', 'true');
                return true;
            }
            return false;
        }
    }

    // Initialize players when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const manager = new DualVideoPlayerManager();
            window.celulaVideoPlayers = manager.players;
        });
    } else {
        const manager = new DualVideoPlayerManager();
        window.celulaVideoPlayers = manager.players;
    }

})();
