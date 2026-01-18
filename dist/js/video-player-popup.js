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
            
            // En móviles, quitar el atributo loop para manejar el cambio de video
            if (window.innerWidth <= 768 && this.side === 'right') {
                this.videoElement.removeAttribute('loop');
            }
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

            // Click y doble click en el video
            this.setupVideoClickHandlers();

            // Progress bar
            this.player.querySelector('.video-progress-bar').addEventListener('click', (e) => this.seek(e));

            // Dragging - usar el contenedor completo (mouse)
            const container = this.player.querySelector('.video-player-container');
            container.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.stopDrag());
            
            // Touch events para móviles
            container.addEventListener('touchstart', (e) => this.startDragTouch(e), { passive: false });
            document.addEventListener('touchmove', (e) => this.dragTouch(e), { passive: false });
            document.addEventListener('touchend', () => this.stopDrag());
            
            // Monitorear cambios de volumen del sistema
            this.monitorSystemVolume();
        }

        setupVideoClickHandlers() {
            let clickCount = 0;
            let clickTimer = null;
            
            this.videoElement.addEventListener('click', (e) => {
                clickCount++;
                
                if (clickCount === 1) {
                    // Esperar para ver si hay un segundo click
                    clickTimer = setTimeout(() => {
                        // Solo un click - toggle play/pause
                        this.togglePlay();
                        clickCount = 0;
                    }, 300);
                } else if (clickCount === 2) {
                    // Doble click - pantalla completa
                    clearTimeout(clickTimer);
                    this.toggleFullscreen();
                    clickCount = 0;
                }
            });
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
                // Si está muteado, desmutear y activar volumen al 100%
                if (this.videoElement.muted) {
                    this.videoElement.muted = false;
                    this.videoElement.volume = 1.0;
                    this.updateMuteIcon();
                    this.notifyOtherPlayer('playing');
                } else if (this.videoElement.volume === 0) {
                    this.videoElement.volume = 1.0;
                }
                this.play();
            } else {
                this.pause();
            }
        }

        play() {
            // Asegurar volumen al 100% si no está muteado
            if (!this.videoElement.muted && this.videoElement.volume < 1.0) {
                this.videoElement.volume = 1.0;
            }
            
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
            
            // Si se desmutea este, mutear el otro y reproducir este video con volumen al 100%
            if (!this.videoElement.muted) {
                this.videoElement.volume = 1.0;
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
            console.log(`Video ended - Side: ${this.side}, Width: ${window.innerWidth}`);
            
            // En móviles, cambiar al siguiente video en el mismo reproductor
            if (window.innerWidth <= 768 && this.side === 'right') {
                // Solo el reproductor derecho maneja el loop en móvil
                this.switchToNextVideo();
            }
        }

        switchToNextVideo() {
            const wasMuted = this.videoElement.muted;
            const currentVolume = this.videoElement.volume;
            const currentSrc = this.videoElement.src;
            
            console.log('Switching video - Current src:', currentSrc);
            
            // Determinar cuál es el siguiente video
            // Orden: Video 2 → Video 1 → Video 2 (loop)
            const isVideo2 = currentSrc.includes('Celula_2');
            const nextVideo = isVideo2 ? VIDEO_CONFIGS.left : VIDEO_CONFIGS.right;
            
            console.log('Next video:', nextVideo.title, nextVideo.src);
            
            // Remover loop temporalmente para este cambio
            this.videoElement.removeAttribute('loop');
            
            // Cambiar la fuente del video
            this.videoElement.src = nextVideo.src;
            this.videoElement.load();
            this.config = nextVideo;
            
            // Heredar estado de mute/unmute y volumen del video anterior
            this.videoElement.volume = currentVolume > 0 ? currentVolume : 1.0;
            this.videoElement.muted = wasMuted;
            
            // Si no estaba muteado, asegurar volumen al 100%
            if (!wasMuted) {
                this.videoElement.volume = 1.0;
            }
            
            // Reproducir el siguiente video cuando esté listo
            this.videoElement.addEventListener('canplaythrough', () => {
                console.log('Video ready, playing...');
                this.play();
                this.updateMuteIcon();
            }, { once: true });
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

        // Touch dragging for mobile
        startDragTouch(event) {
            // No permitir drag si se está tocando en botones o en el video
            if (event.target.closest('button') || 
                event.target.closest('video') || 
                event.target.closest('.video-progress-bar')) {
                return;
            }
            
            event.preventDefault();
            this.isDragging = true;
            
            const touch = event.touches[0];
            const rect = this.player.getBoundingClientRect();
            
            this.dragOffset = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
            
            this.player.style.transition = 'none';
        }

        dragTouch(event) {
            if (!this.isDragging) return;
            
            event.preventDefault();
            const touch = event.touches[0];
            
            const x = touch.clientX - this.dragOffset.x;
            const y = touch.clientY - this.dragOffset.y;
            
            // Limitar dentro de los bordes de la pantalla
            const maxX = window.innerWidth - this.player.offsetWidth;
            const maxY = window.innerHeight - this.player.offsetHeight;
            
            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));
            
            this.player.style.left = boundedX + 'px';
            this.player.style.top = boundedY + 'px';
            this.player.style.right = 'auto';
            this.player.style.bottom = 'auto';
        }

        // Monitor system volume changes
        monitorSystemVolume() {
            // Detectar cambios en el volumen del video (que puede ser afectado por el volumen del sistema)
            let lastVolume = this.videoElement.volume;
            
            const checkVolume = () => {
                // Si el volumen cambió y no está en mute, asumir que fue el usuario desde botones físicos
                if (this.videoElement.volume !== lastVolume && !this.videoElement.muted) {
                    if (this.videoElement.volume > lastVolume && this.videoElement.paused) {
                        // Volumen subió y video está pausado -> reproducir
                        this.videoElement.muted = false;
                        this.play();
                        this.updateMuteIcon();
                        this.notifyOtherPlayer('playing');
                    }
                    lastVolume = this.videoElement.volume;
                }
            };
            
            // Revisar cada 500ms
            setInterval(checkVolume, 500);
            
            // También escuchar evento volumechange
            this.videoElement.addEventListener('volumechange', () => {
                const currentVolume = this.videoElement.volume;
                
                // Si subió el volumen desde 0 o desde mute, activar reproducción
                if (currentVolume > 0 && currentVolume > lastVolume && this.videoElement.muted) {
                    this.videoElement.muted = false;
                    if (this.videoElement.paused) {
                        this.play();
                    }
                    this.updateMuteIcon();
                    this.notifyOtherPlayer('playing');
                }
                
                lastVolume = currentVolume;
            });
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
