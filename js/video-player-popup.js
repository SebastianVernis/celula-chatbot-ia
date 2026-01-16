/**
 * Persistent Video Player Popup
 * Reproductor de video estilo video.js sin dependencias externas
 * Mantiene persistencia entre páginas usando localStorage
 */

(function() {
    'use strict';

    const VIDEO_PLAYER_KEY = 'celula_video_player_state';
    const VIDEO_SOURCES = [
        {
            src: '/assets/video/Video_Promocional_Grupo_Musical_Celula_1.webm',
            type: 'video/webm',
            title: 'Video Promocional - Parte 1'
        },
        {
            src: '/assets/video/Video_Promocional_Grupo_Musical_Celula_2.webm',
            type: 'video/webm',
            title: 'Video Promocional - Parte 2'
        }
    ];

    class VideoPlayerPopup {
        constructor() {
            this.player = null;
            this.videoElement = null;
            this.currentVideoIndex = 0;
            this.isPlaying = false;
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
                            <span class="video-player-title">${VIDEO_SOURCES[0].title}</span>
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
                        
                        <div class="video-player-wrapper">
                            <video 
                                class="video-player-element" 
                                preload="metadata"
                                playsinline
                            >
                                <source src="${VIDEO_SOURCES[0].src}" type="${VIDEO_SOURCES[0].type}">
                                Tu navegador no soporta la reproducción de video.
                            </video>
                            
                            <div class="video-player-overlay">
                                <button class="video-btn-play-large" aria-label="Reproducir">
                                    <svg viewBox="0 0 24 24" width="60" height="60" fill="currentColor">
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
                                <svg class="icon-play" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                <svg class="icon-pause hidden" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                                </svg>
                            </button>

                            <button class="video-btn-next" aria-label="Siguiente video" title="Siguiente video">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M6 4l10 8-10 8V4zm10 0v16h2V4h-2z"/>
                                </svg>
                            </button>

                            <div class="video-progress-container">
                                <div class="video-progress-bar">
                                    <div class="video-progress-played"></div>
                                    <div class="video-progress-buffered"></div>
                                    <div class="video-progress-handle"></div>
                                </div>
                                <div class="video-time">
                                    <span class="video-time-current">0:00</span>
                                    <span class="video-time-separator">/</span>
                                    <span class="video-time-duration">0:00</span>
                                </div>
                            </div>

                            <div class="video-volume-container">
                                <button class="video-btn-mute" aria-label="Silenciar/Activar sonido">
                                    <svg class="icon-volume" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                                    </svg>
                                    <svg class="icon-mute hidden" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                    </svg>
                                </button>
                                <input 
                                    type="range" 
                                    class="video-volume-slider" 
                                    min="0" 
                                    max="100" 
                                    value="70"
                                    aria-label="Control de volumen"
                                >
                            </div>

                            <button class="video-btn-fullscreen" aria-label="Pantalla completa">
                                <svg class="icon-fullscreen" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                </svg>
                                <svg class="icon-fullscreen-exit hidden" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                                </svg>
                            </button>
                        </div>

                        <div class="video-player-playlist">
                            <div class="video-playlist-title">Lista de reproducción</div>
                            <div class="video-playlist-items"></div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', playerHTML);
            
            this.player = document.getElementById('celula-video-player');
            this.videoElement = this.player.querySelector('.video-player-element');
            
            // Configurar volumen inicial
            this.videoElement.volume = this.volume;
            
            // Crear playlist
            this.createPlaylist();
        }

        createPlaylist() {
            const playlistContainer = this.player.querySelector('.video-playlist-items');
            
            VIDEO_SOURCES.forEach((video, index) => {
                const item = document.createElement('div');
                item.className = `video-playlist-item ${index === 0 ? 'active' : ''}`;
                item.dataset.index = index;
                item.innerHTML = `
                    <div class="video-playlist-item-number">${index + 1}</div>
                    <div class="video-playlist-item-title">${video.title}</div>
                    <div class="video-playlist-item-duration">2:32</div>
                `;
                
                item.addEventListener('click', () => this.loadVideo(index));
                playlistContainer.appendChild(item);
            });
        }

        setupEventListeners() {
            const video = this.videoElement;
            
            // Video events
            video.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
            video.addEventListener('timeupdate', () => this.onTimeUpdate());
            video.addEventListener('progress', () => this.onProgress());
            video.addEventListener('ended', () => this.onVideoEnded());
            video.addEventListener('play', () => this.onPlay());
            video.addEventListener('pause', () => this.onPause());
            video.addEventListener('waiting', () => this.showLoading());
            video.addEventListener('canplay', () => this.hideLoading());
            video.addEventListener('error', (e) => this.onVideoError(e));

            // Control buttons
            this.player.querySelector('.video-btn-play').addEventListener('click', () => this.togglePlay());
            this.player.querySelector('.video-btn-play-large').addEventListener('click', () => this.togglePlay());
            this.player.querySelector('.video-btn-next').addEventListener('click', () => this.nextVideo());
            this.player.querySelector('.video-btn-mute').addEventListener('click', () => this.toggleMute());
            this.player.querySelector('.video-btn-fullscreen').addEventListener('click', () => this.toggleFullscreen());
            this.player.querySelector('.video-btn-minimize').addEventListener('click', () => this.minimize());
            this.player.querySelector('.video-btn-close').addEventListener('click', () => this.hide());

            // Progress bar
            const progressContainer = this.player.querySelector('.video-progress-container');
            progressContainer.addEventListener('click', (e) => this.seek(e));
            
            // Volume slider
            const volumeSlider = this.player.querySelector('.video-volume-slider');
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));

            // Dragging
            const header = this.player.querySelector('.video-player-header');
            header.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.stopDrag());

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));

            // Guardar estado antes de cambiar de página
            window.addEventListener('beforeunload', () => this.saveState());
        }

        // Video control methods
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
                    console.warn('Auto-play prevented:', error);
                });
            }
        }

        pause() {
            this.videoElement.pause();
        }

        nextVideo() {
            this.currentVideoIndex = (this.currentVideoIndex + 1) % VIDEO_SOURCES.length;
            this.loadVideo(this.currentVideoIndex);
        }

        loadVideo(index) {
            this.currentVideoIndex = index;
            const video = VIDEO_SOURCES[index];
            const currentTime = this.videoElement.currentTime;
            const wasPlaying = !this.videoElement.paused;
            
            this.videoElement.src = video.src;
            this.player.querySelector('.video-player-title').textContent = video.title;
            
            // Update playlist
            this.player.querySelectorAll('.video-playlist-item').forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            
            if (wasPlaying) {
                this.videoElement.play();
            }
            
            this.saveState();
        }

        toggleMute() {
            this.videoElement.muted = !this.videoElement.muted;
            this.updateMuteIcon();
        }

        setVolume(value) {
            this.volume = value;
            this.videoElement.volume = value;
            this.videoElement.muted = value === 0;
            this.updateMuteIcon();
            this.saveState();
        }

        toggleFullscreen() {
            const container = this.player.querySelector('.video-player-container');
            
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                }
                this.updateFullscreenIcon(true);
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                this.updateFullscreenIcon(false);
            }
        }

        seek(event) {
            const progressContainer = this.player.querySelector('.video-progress-container');
            const rect = progressContainer.getBoundingClientRect();
            const pos = (event.clientX - rect.left) / rect.width;
            this.videoElement.currentTime = pos * this.videoElement.duration;
        }

        // Event handlers
        onLoadedMetadata() {
            this.updateDuration();
        }

        onTimeUpdate() {
            this.updateProgress();
            this.updateTimeDisplay();
        }

        onProgress() {
            this.updateBuffered();
        }

        onVideoEnded() {
            // Auto-play next video in loop
            this.nextVideo();
        }

        onPlay() {
            this.isPlaying = true;
            this.updatePlayIcon();
            this.hideOverlay();
        }

        onPause() {
            this.isPlaying = false;
            this.updatePlayIcon();
            this.showOverlay();
        }

        onVideoError(event) {
            console.error('Video error:', event);
            // Try next video on error
            this.nextVideo();
        }

        // UI update methods
        updatePlayIcon() {
            const playIcon = this.player.querySelector('.icon-play');
            const pauseIcon = this.player.querySelector('.icon-pause');
            
            if (this.isPlaying) {
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
            
            if (this.videoElement.muted || this.videoElement.volume === 0) {
                volumeIcon.classList.add('hidden');
                muteIcon.classList.remove('hidden');
            } else {
                volumeIcon.classList.remove('hidden');
                muteIcon.classList.add('hidden');
            }
        }

        updateFullscreenIcon(isFullscreen) {
            const fullscreenIcon = this.player.querySelector('.icon-fullscreen');
            const exitIcon = this.player.querySelector('.icon-fullscreen-exit');
            
            if (isFullscreen) {
                fullscreenIcon.classList.add('hidden');
                exitIcon.classList.remove('hidden');
            } else {
                fullscreenIcon.classList.remove('hidden');
                exitIcon.classList.add('hidden');
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
            this.pause();
            this.saveState();
        }

        // Keyboard shortcuts
        handleKeyboard(event) {
            if (this.player.classList.contains('hidden')) return;
            
            // Solo manejar shortcuts si el reproductor está visible
            const target = event.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            switch(event.key.toLowerCase()) {
                case ' ':
                case 'k':
                    event.preventDefault();
                    this.togglePlay();
                    break;
                case 'arrowleft':
                    event.preventDefault();
                    this.videoElement.currentTime -= 5;
                    break;
                case 'arrowright':
                    event.preventDefault();
                    this.videoElement.currentTime += 5;
                    break;
                case 'arrowup':
                    event.preventDefault();
                    this.setVolume(Math.min(1, this.volume + 0.1));
                    this.player.querySelector('.video-volume-slider').value = this.volume * 100;
                    break;
                case 'arrowdown':
                    event.preventDefault();
                    this.setVolume(Math.max(0, this.volume - 0.1));
                    this.player.querySelector('.video-volume-slider').value = this.volume * 100;
                    break;
                case 'm':
                    event.preventDefault();
                    this.toggleMute();
                    break;
                case 'f':
                    event.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'n':
                    event.preventDefault();
                    this.nextVideo();
                    break;
            }
        }

        // State persistence
        saveState() {
            const state = {
                currentVideoIndex: this.currentVideoIndex,
                currentTime: this.videoElement.currentTime,
                volume: this.volume,
                isPlaying: !this.videoElement.paused,
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
                this.currentVideoIndex = state.currentVideoIndex || 0;
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
