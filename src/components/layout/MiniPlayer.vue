<template>
    <div
        v-if="shouldRender"
        class="mini-player"
        :class="{ 'is-dragging': isMiniDragging }"
        :style="miniDragStyle"
        @click="openFullPlayer"
        @mousedown="onMiniMouseDown"
        @touchstart="onMiniTouchStart"
    >
        <div class="mini-cover">
            <img v-if="hasTrack" :src="state.albumCover" alt="mini-cover" />
            <div v-else class="mini-cover-placeholder"></div>
        </div>
        <div class="mini-meta">
            <p class="mini-title">{{ hasTrack ? state.songName || '재생 중' : '노래가 재생중이지 않습니다' }}</p>
            <p class="mini-artist">{{ hasTrack ? state.singerName || '아티스트' : '재생 버튼으로 시작해 주세요' }}</p>
        </div>
        <div class="mini-controls">
            <button type="button" @click.stop="onPrevClick" :disabled="!hasTrack">
                <img class="arrow" :src="prevIcon" alt="prev-track" />
            </button>
            <button type="button" @click.stop="onTogglePlayClick" :disabled="!hasTrack">
                <img :src="state.isPlaying ? pauseIcon : playIcon" alt="toggle-play" />
            </button>
            <button type="button" @click.stop="onNextClick" :disabled="!hasTrack">
                <img class="arrow" :src="nextIcon" alt="next-track" />
            </button>
        </div>
    </div>
    <audio
        ref="audio"
        preload="metadata"
        @loadedmetadata="onAudioLoadedMetadata"
        @timeupdate="onAudioTimeUpdate"
        @ended="onAudioEnded"
    ></audio>
</template>

<script>
import pauseIcon from '@/assets/images/player/pause.png';
import playIcon from '@/assets/images/player/play.png';
import prevIcon from '@/assets/images/player/prev.png';
import nextIcon from '@/assets/images/player/next.png';

const PLAYER_STATE_KEY = 'mute-player-state';
const ONBOARDING_PATHS = ['/splash', '/signup', '/signup-info', '/welcome', '/artist-select', '/loading'];

export default {
    name: 'MiniPlayer',
    props: {
        fullPlayerOpen: {
            type: Boolean,
            default: false
        }
    },
    emits: ['open-player'],
    data() {
        return {
            pauseIcon,
            playIcon,
            prevIcon,
            nextIcon,
            state: {
                tracks: [],
                currentIndex: 0,
                songName: '',
                singerName: '',
                albumCover: '',
                currentTime: 0,
                isPlaying: false,
                miniVisible: false,
                playerPath: ''
            },
            syncing: false,
            lastPersistAt: 0,
            persistIntervalMs: 2000,
            resumeRetryTimer: null,
            resumeRetryCount: 0,
            waitingUserGestureForPlay: false,
            hasAutoplayErrorLogged: false,
            isMiniDragging: false,
            miniStartX: 0,
            miniStartY: 0,
            miniDeltaX: 0,
            miniDeltaY: 0,
            miniDragMoved: false,
            suppressClickByDrag: false
        };
    },
    computed: {
        shouldRender() {
            if (this.fullPlayerOpen) return false;
            if (ONBOARDING_PATHS.some((path) => this.$route.path.startsWith(path))) return false;
            if (this.$route.path.startsWith('/main/player/')) return false;
            if (!this.state.miniVisible) return false;
            if (!this.hasTrack) return false;
            return true;
        },
        currentTrack() {
            return this.state.tracks[this.state.currentIndex] ?? null;
        },
        hasTrack() {
            return !!this.currentTrack?.previewUrl;
        },
        miniDragStyle() {
            const dragX = Math.min(0, this.miniDeltaX);
            const dragY = Math.min(0, this.miniDeltaY);
            const expandHeight = Math.min(160, Math.max(0, -dragY * 0.9));
            return {
                '--mini-drag-x': `${dragX}px`,
                '--mini-expand-h': `${expandHeight}px`,
                opacity: this.isMiniDragging ? Math.max(0.35, 1 - Math.abs(dragX) / 220) : 1,
                transition: this.isMiniDragging ? 'none' : 'transform 180ms ease, height 180ms ease, opacity 180ms ease'
            };
        }
    },
    mounted() {
        this.hydrateFromStorage();
        window.addEventListener('storage', this.onStorageChange);
        window.addEventListener('mute-player-state-updated', this.onSameTabStateUpdated);
        window.addEventListener('mute-player-request-mini-resume', this.onMiniResumeRequest);
        window.addEventListener('mute-player-request-mini-handoff', this.onMiniHandoffRequest);
        window.addEventListener('mousemove', this.onMiniMouseMove);
        window.addEventListener('mouseup', this.onMiniMouseUp);
        window.addEventListener('touchmove', this.onMiniTouchMove, { passive: false });
        window.addEventListener('touchend', this.onMiniTouchEnd);
        this.syncBodyMiniPlayerClass(this.shouldRender);
    },
    beforeUnmount() {
        window.removeEventListener('storage', this.onStorageChange);
        window.removeEventListener('mute-player-state-updated', this.onSameTabStateUpdated);
        window.removeEventListener('mute-player-request-mini-resume', this.onMiniResumeRequest);
        window.removeEventListener('mute-player-request-mini-handoff', this.onMiniHandoffRequest);
        window.removeEventListener('mousemove', this.onMiniMouseMove);
        window.removeEventListener('mouseup', this.onMiniMouseUp);
        window.removeEventListener('touchmove', this.onMiniTouchMove);
        window.removeEventListener('touchend', this.onMiniTouchEnd);
        this.detachUserGestureListeners();
        this.syncBodyMiniPlayerClass(false);
        if (this.resumeRetryTimer) {
            clearTimeout(this.resumeRetryTimer);
            this.resumeRetryTimer = null;
        }
    },
    watch: {
        '$route.path'() {
            this.hydrateFromStorage();
        },
        shouldRender(next) {
            this.syncBodyMiniPlayerClass(next);
            if (next && this.state.isPlaying) {
                this.ensurePlaybackResume();
            }
        },
        'state.isPlaying'(next) {
            if (next && this.shouldRender) {
                this.ensurePlaybackResume();
            }
        }
    },
    methods: {
        onMiniMouseDown(e) {
            if (e.button !== 0) return;
            this.startMiniDrag(e.clientX, e.clientY);
        },

        onMiniTouchStart(e) {
            this.startMiniDrag(e.touches[0].clientX, e.touches[0].clientY);
        },

        startMiniDrag(startX, startY) {
            this.isMiniDragging = true;
            this.miniStartX = startX;
            this.miniStartY = startY;
            this.miniDeltaX = 0;
            this.miniDeltaY = 0;
            this.miniDragMoved = false;
        },

        onMiniMouseMove(e) {
            if (!this.isMiniDragging) return;
            this.updateMiniDrag(e.clientX, e.clientY);
        },

        onMiniTouchMove(e) {
            if (!this.isMiniDragging) return;
            this.updateMiniDrag(e.touches[0].clientX, e.touches[0].clientY);
            e.preventDefault();
        },

        updateMiniDrag(currentX, currentY) {
            this.miniDeltaX = currentX - this.miniStartX;
            this.miniDeltaY = currentY - this.miniStartY;
            if (Math.abs(this.miniDeltaX) > 6 || Math.abs(this.miniDeltaY) > 6) {
                this.miniDragMoved = true;
                this.suppressClickByDrag = true;
            }
        },

        onMiniMouseUp() {
            this.finishMiniDrag();
        },

        onMiniTouchEnd() {
            this.finishMiniDrag();
        },

        finishMiniDrag() {
            if (!this.isMiniDragging) return;
            const absX = Math.abs(this.miniDeltaX);
            const absY = Math.abs(this.miniDeltaY);
            const isHorizontal = absX > absY;
            const isVertical = absY > absX;
            const shouldDismiss = isHorizontal && this.miniDeltaX <= -90;
            const shouldOpenPlayer = isVertical && this.miniDeltaY <= -45;
            this.isMiniDragging = false;

            if (shouldDismiss) {
                this.dismissAndClearPlayerState();
            } else if (shouldOpenPlayer) {
                this.openFullPlayer(true);
            }

            this.miniStartX = 0;
            this.miniStartY = 0;
            this.miniDeltaX = 0;
            this.miniDeltaY = 0;
        },

        shouldSkipClickByDrag() {
            if (!this.suppressClickByDrag) return false;
            this.suppressClickByDrag = false;
            this.miniDragMoved = false;
            return true;
        },

        onPrevClick() {
            if (this.shouldSkipClickByDrag()) return;
            this.playPrev();
        },

        onTogglePlayClick() {
            if (this.shouldSkipClickByDrag()) return;
            this.togglePlay();
        },

        onNextClick() {
            if (this.shouldSkipClickByDrag()) return;
            this.playNext();
        },

        dismissAndClearPlayerState() {
            const audio = this.$refs.audio;
            if (audio) audio.pause();
            this.state = {
                ...this.state,
                tracks: [],
                currentIndex: 0,
                songName: '',
                singerName: '',
                albumCover: '',
                currentTime: 0,
                isPlaying: false,
                miniVisible: false,
                playerPath: ''
            };
            localStorage.removeItem(PLAYER_STATE_KEY);
            this.syncBodyMiniPlayerClass(false);
        },

        onAudioLoadedMetadata() {
            const audio = this.$refs.audio;
            if (!audio) return;
        },

        onAudioTimeUpdate() {
            const audio = this.$refs.audio;
            if (!audio) return;
            this.state.currentTime = audio.currentTime || 0;
            this.persistState(false);
        },

        onAudioEnded() {
            this.playNext(true);
        },

        onStorageChange(e) {
            if (e.key !== PLAYER_STATE_KEY) return;
            this.hydrateFromStorage();
        },

        onSameTabStateUpdated() {
            this.hydrateFromStorage();
        },

        onMiniResumeRequest(e) {
            this.hydrateFromStorage();
            const handoffTime = e?.detail?.currentTime;
            if (Number.isFinite(handoffTime)) {
                this.state.currentTime = handoffTime;
            }
            if (!this.state.isPlaying) return;
            this.playAudio(this.state.currentTime);
        },

        onMiniHandoffRequest(e) {
            const audio = this.$refs.audio;
            if (!audio) {
                const consume = e?.detail?.consume;
                if (typeof consume === 'function') consume(this.state.currentTime || 0);
                return;
            }
            const liveTime = audio.currentTime || this.state.currentTime || 0;
            this.state.currentTime = liveTime;
            this.persistState();
            audio.pause();
            const consume = e?.detail?.consume;
            if (typeof consume === 'function') consume(liveTime);
        },

        hydrateFromStorage() {
            try {
                const raw = localStorage.getItem(PLAYER_STATE_KEY);
                if (!raw) return;
                const saved = JSON.parse(raw);
                const { currentTime: _ignoredCurrentTime, ...savedWithoutTime } = saved || {};
                this.state = {
                    ...this.state,
                    ...savedWithoutTime
                };

                if (!this.state.playerPath) {
                    this.state.playerPath = `/main/player/${this.state.currentIndex || 0}`;
                }

                this.syncAudioSource();

                if (this.state.isPlaying && this.shouldRender) {
                    this.ensurePlaybackResume();
                }
            } catch (err) {
                console.error('Mini player state parse failed:', err);
            }
        },

        syncAudioSource() {
            const audio = this.$refs.audio;
            if (!audio || !this.currentTrack?.previewUrl) return;
            if (audio.src !== this.currentTrack.previewUrl) {
                audio.src = this.currentTrack.previewUrl;
                audio.load();
            }
        },

        waitForAudioReady(audio) {
            return new Promise((resolve) => {
                if (!audio) {
                    resolve();
                    return;
                }

                if (audio.readyState >= 2) {
                    resolve();
                    return;
                }

                const onReady = () => {
                    cleanup();
                    resolve();
                };

                const onTimeout = () => {
                    cleanup();
                    resolve();
                };

                const cleanup = () => {
                    audio.removeEventListener('canplay', onReady);
                    audio.removeEventListener('loadedmetadata', onReady);
                    clearTimeout(timer);
                };

                const timer = setTimeout(onTimeout, 700);
                audio.addEventListener('canplay', onReady, { once: true });
                audio.addEventListener('loadedmetadata', onReady, { once: true });
            });
        },

        persistState(force = true) {
            if (this.syncing) return;
            const now = Date.now();
            if (!force && now - this.lastPersistAt < this.persistIntervalMs) return;
            this.syncing = true;
            const { currentTime: _ignoredCurrentTime, ...persistedState } = this.state;
            localStorage.setItem(PLAYER_STATE_KEY, JSON.stringify(persistedState));
            this.syncing = false;
            this.lastPersistAt = now;
        },

        syncBodyMiniPlayerClass(visible) {
            document.body.classList.toggle('has-mini-player', !!visible);
        },

        attachUserGestureListeners() {
            window.addEventListener('pointerdown', this.onFirstUserGesture, { once: true });
            window.addEventListener('keydown', this.onFirstUserGesture, { once: true });
        },

        detachUserGestureListeners() {
            window.removeEventListener('pointerdown', this.onFirstUserGesture);
            window.removeEventListener('keydown', this.onFirstUserGesture);
        },

        onFirstUserGesture() {
            this.waitingUserGestureForPlay = false;
            this.playAudio();
        },

        async playAudio(startAt = null) {
            const audio = this.$refs.audio;
            if (!audio || !this.currentTrack?.previewUrl) return;
            const prevSrc = audio.src;
            this.syncAudioSource();
            try {
                if (audio.src !== prevSrc) {
                    await this.waitForAudioReady(audio);
                }
                const targetTime = Number.isFinite(startAt) ? startAt : this.state.currentTime;
                if (targetTime > 0 && Math.abs(audio.currentTime - targetTime) > 0.2) {
                    audio.currentTime = targetTime;
                }
                await audio.play();
                this.state.isPlaying = true;
                this.waitingUserGestureForPlay = false;
                this.hasAutoplayErrorLogged = false;
                this.detachUserGestureListeners();
                this.resumeRetryCount = 0;
                if (this.resumeRetryTimer) {
                    clearTimeout(this.resumeRetryTimer);
                    this.resumeRetryTimer = null;
                }
                this.persistState();
            } catch (err) {
                const blockedByAutoplay = err?.name === 'NotAllowedError';
                if (blockedByAutoplay) {
                    this.waitingUserGestureForPlay = true;
                    if (!this.hasAutoplayErrorLogged) {
                        this.hasAutoplayErrorLogged = true;
                        console.warn('Mini player autoplay blocked. Waiting for next user gesture.');
                    }
                    this.attachUserGestureListeners();
                    return;
                }
                console.error('Mini player play failed:', err);
            }
        },

        ensurePlaybackResume() {
            const audio = this.$refs.audio;
            if (!audio) return;
            if (!this.shouldRender || !this.state.isPlaying) return;
            if (this.waitingUserGestureForPlay) return;
            if (!audio.paused && !audio.ended) return;

            this.playAudio();

            if (this.resumeRetryCount >= 6) return;
            if (this.resumeRetryTimer) clearTimeout(this.resumeRetryTimer);
            this.resumeRetryCount += 1;
            this.resumeRetryTimer = setTimeout(() => {
                this.ensurePlaybackResume();
            }, 220);
        },

        findNextPlayableIndex() {
            for (let i = this.state.currentIndex + 1; i < this.state.tracks.length; i += 1) {
                if (this.state.tracks[i]?.previewUrl) return i;
            }
            for (let i = 0; i < this.state.currentIndex; i += 1) {
                if (this.state.tracks[i]?.previewUrl) return i;
            }
            return -1;
        },

        findPrevPlayableIndex() {
            for (let i = this.state.currentIndex - 1; i >= 0; i -= 1) {
                if (this.state.tracks[i]?.previewUrl) return i;
            }
            return -1;
        },

        pauseAudio() {
            const audio = this.$refs.audio;
            if (!audio) return;
            audio.pause();
            this.state.isPlaying = false;
            this.persistState();
        },

        togglePlay() {
            if (this.state.isPlaying) {
                this.pauseAudio();
            } else {
                this.playAudio();
            }
        },

        async playNext(forceAutoplay = false) {
            if (!this.state.tracks.length) return;
            const nextIndex = this.findNextPlayableIndex();
            if (nextIndex < 0) return;

            this.state.currentIndex = nextIndex;
            const nextTrack = this.currentTrack;
            if (nextTrack) {
                this.state.songName = nextTrack.trackName || this.state.songName;
                this.state.singerName = nextTrack.artistName || this.state.singerName;
                this.state.albumCover = nextTrack.albumCover || this.state.albumCover;
            }
            this.state.currentTime = 0;
            this.state.playerPath = `/main/player/${this.state.currentIndex || 0}`;
            this.persistState();
            if (this.state.isPlaying || forceAutoplay) {
                this.state.isPlaying = true;
                await this.playAudio();
            } else {
                this.syncAudioSource();
            }
        },

        async playPrev() {
            if (!this.state.tracks.length) return;
            const audio = this.$refs.audio;
            if (!audio) return;

            if ((audio.currentTime || 0) > 3 || this.state.currentIndex === 0) {
                audio.currentTime = 0;
                this.state.currentTime = 0;
                this.persistState();
                return;
            }

            const prevIndex = this.findPrevPlayableIndex();
            if (prevIndex < 0) return;

            this.state.currentIndex = prevIndex;
            const prevTrack = this.currentTrack;
            if (prevTrack) {
                this.state.songName = prevTrack.trackName || this.state.songName;
                this.state.singerName = prevTrack.artistName || this.state.singerName;
                this.state.albumCover = prevTrack.albumCover || this.state.albumCover;
            }
            this.state.currentTime = 0;
            this.state.playerPath = `/main/player/${this.state.currentIndex || 0}`;
            this.persistState();

            if (this.state.isPlaying) {
                await this.playAudio();
            } else {
                this.syncAudioSource();
            }
        },

        openFullPlayer(fromSwipe = false) {
            if (!fromSwipe && this.shouldSkipClickByDrag()) return;
            if (!this.hasTrack) return;
            const audio = this.$refs.audio;
            if (audio) {
                this.state.currentTime = audio.currentTime || this.state.currentTime;
                this.state.isPlaying = !audio.paused;
            }
            this.state.miniVisible = false;
            this.persistState();
            this.$emit('open-player');
        }
    }
};
</script>

<style scoped>
.mini-player {
    position: fixed;
    left: 50%;
    width: calc(100% - 24px);
    max-width: 500px;
    transform: translateX(calc(-50% + var(--mini-drag-x, 0px)));
    bottom: 82px;
    height: calc(82px + var(--mini-expand-h, 0px));
    display: grid;
    grid-template-columns: 46px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 8px 20px;
    background: var(--color-black);
    color: var(--color-white);
    backdrop-filter: blur(8px);
    z-index: 30;
    cursor: grab;
}

.mini-player.is-dragging {
    cursor: grabbing;
}

.mini-cover {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    overflow: hidden;
}

.mini-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.mini-cover-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(145deg, #3a3d44, #2a2d33);
}

.mini-meta {
    min-width: 0;
}

.mini-title,
.mini-artist {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mini-title {
    font-size: 13px;
    font-weight: 600;
}

.mini-artist {
    font-size: 11px;
    color: var(--color-white);
    margin-top: 3px;
}

.mini-controls {
    display: flex;
    align-items: center;
    gap: 30px;
}

.mini-controls button {
    width: 28px;
    height: 28px;
    border: 0;
    padding: 0;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.mini-controls button:disabled {
    opacity: 0.45;
    cursor: default;
}

.mini-controls img {
    width: 20px;
    height: 20px;
}
.arrow {
    filter: invert(1);
}
</style>
