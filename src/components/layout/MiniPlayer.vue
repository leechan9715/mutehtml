<template>
    <div v-if="shouldRender" class="mini-player" @click="openFullPlayer">
        <div class="mini-cover">
            <img v-if="hasTrack" :src="state.albumCover" alt="mini-cover" />
            <div v-else class="mini-cover-placeholder"></div>
        </div>
        <div class="mini-meta">
            <p class="mini-title">{{ hasTrack ? state.songName || '재생 중' : '노래가 재생중이지 않습니다' }}</p>
            <p class="mini-artist">{{ hasTrack ? state.singerName || '아티스트' : '재생 버튼으로 시작해 주세요' }}</p>
        </div>
        <div class="mini-controls">
            <button type="button" @click.stop="togglePlay" :disabled="!hasTrack">
                <img :src="state.isPlaying ? pauseIcon : playIcon" alt="toggle-play" />
            </button>
            <button type="button" @click.stop="playNext" :disabled="!hasTrack">
                <img :src="nextIcon" alt="next-track" />
            </button>
        </div>
        <audio
            ref="audio"
            preload="metadata"
            @loadedmetadata="onAudioLoadedMetadata"
            @timeupdate="onAudioTimeUpdate"
            @ended="onAudioEnded"
        ></audio>
    </div>
</template>

<script>
import pauseIcon from '@/assets/images/player/pause.png';
import playIcon from '@/assets/images/player/play.png';
import nextIcon from '@/assets/images/player/next.png';

const PLAYER_STATE_KEY = 'mute-player-state';
const ONBOARDING_PATHS = ['/splash', '/signup', '/signup-info', '/welcome', '/artist-select', '/loading'];

export default {
    name: 'MiniPlayer',
    data() {
        return {
            pauseIcon,
            playIcon,
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
            resumeRetryTimer: null,
            resumeRetryCount: 0
        };
    },
    computed: {
        shouldRender() {
            if (ONBOARDING_PATHS.some((path) => this.$route.path.startsWith(path))) return false;
            if (this.$route.path.startsWith('/main/player/')) return false;
            return true;
        },
        currentTrack() {
            return this.state.tracks[this.state.currentIndex] ?? null;
        },
        hasTrack() {
            return !!this.currentTrack?.previewUrl;
        }
    },
    mounted() {
        this.hydrateFromStorage();
        window.addEventListener('storage', this.onStorageChange);
    },
    beforeUnmount() {
        window.removeEventListener('storage', this.onStorageChange);
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
        onAudioLoadedMetadata() {
            const audio = this.$refs.audio;
            if (!audio) return;

            if (this.state.currentTime > 0) {
                audio.currentTime = Math.min(this.state.currentTime, audio.duration || this.state.currentTime);
            }
        },

        onAudioTimeUpdate() {
            const audio = this.$refs.audio;
            if (!audio) return;
            this.state.currentTime = audio.currentTime || 0;
            this.persistState();
        },

        onAudioEnded() {
            this.playNext(true);
        },

        onStorageChange(e) {
            if (e.key !== PLAYER_STATE_KEY) return;
            this.hydrateFromStorage();
        },

        hydrateFromStorage() {
            try {
                const raw = localStorage.getItem(PLAYER_STATE_KEY);
                if (!raw) return;
                const saved = JSON.parse(raw);
                this.state = {
                    ...this.state,
                    ...saved
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

        persistState() {
            if (this.syncing) return;
            this.syncing = true;
            localStorage.setItem(PLAYER_STATE_KEY, JSON.stringify(this.state));
            this.syncing = false;
        },

        async playAudio() {
            const audio = this.$refs.audio;
            if (!audio || !this.currentTrack?.previewUrl) return;
            const prevSrc = audio.src;
            this.syncAudioSource();
            try {
                if (audio.src !== prevSrc) {
                    await this.waitForAudioReady(audio);
                }
                if (this.state.currentTime > 0 && Math.abs(audio.currentTime - this.state.currentTime) > 0.5) {
                    audio.currentTime = this.state.currentTime;
                }
                await audio.play();
                this.state.isPlaying = true;
                this.resumeRetryCount = 0;
                if (this.resumeRetryTimer) {
                    clearTimeout(this.resumeRetryTimer);
                    this.resumeRetryTimer = null;
                }
                this.persistState();
            } catch (err) {
                console.error('Mini player play failed:', err);
            }
        },

        ensurePlaybackResume() {
            const audio = this.$refs.audio;
            if (!audio) return;
            if (!this.shouldRender || !this.state.isPlaying) return;
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

        openFullPlayer() {
            if (!this.hasTrack) return;
            this.state.miniVisible = false;
            this.persistState();
            const targetPath = this.state.playerPath || `/main/player/${this.state.currentIndex || 0}`;
            this.$router.push(targetPath);
        }
    }
};
</script>

<style scoped>
.mini-player {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 82px;
    height: 62px;
    display: grid;
    grid-template-columns: 46px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 14px;
    background: rgba(18, 19, 22, 0.94);
    color: #fff;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(8px);
    z-index: 30;
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
    color: rgba(255, 255, 255, 0.76);
    margin-top: 3px;
}

.mini-controls {
    display: flex;
    align-items: center;
    gap: 8px;
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
</style>
