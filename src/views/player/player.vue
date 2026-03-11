<template>
    <h2 class="hidden">플레이어</h2>
    <div id="player-wrap" ref="playerWrap" :style="playerWrapStyle">
        <section class="container album-cover" ref="artistImgBox">
            <div class="row down-handle">
                <img
                    src="@/assets/images/popupdown/slidedown.png"
                    alt="slidedowns"
                    :class="{ 'is-grabbing': isHandleDragging }"
                    @mousedown.prevent="onHandleMouseDown"
                    @touchstart.prevent="onHandleTouchStart"
                />
            </div>
            <div class="row player-img">
                <div class="col-1">
                    <div class="artist-img">
                        <img
                            :src="albumCover"
                            alt="player-img1"
                            crossorigin="anonymous"
                            ref="albumImage"
                            @load="applyBackgroundColor"
                        />
                    </div>
                </div>
            </div>
        </section>
        <section class="container color-box">
            <div class="player-info">
                <p class="song-name">{{ songName }}</p>
                <p class="singer-name">{{ singerName }}</p>
            </div>
            <audio
                ref="audio"
                :src="currentTrack?.previewUrl"
                preload="metadata"
                @loadedmetadata="onLoadedMetadata"
                @timeupdate="onTimeUpdate"
                @ended="onEnded"
            ></audio>

            <div class="music-progress-container">
                <div
                    class="progress-bar"
                    ref="progressBar"
                    @mousedown="onProgressMouseDown"
                    @touchstart.passive="onProgressTouchStart"
                >
                    <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
                    <div class="progress-thumb" :style="{ left: progressPercent + '%' }"></div>
                </div>
                <div class="time-display">
                    <span class="current-time">{{ formatTime(currentTime) }}</span>
                    <span class="total-time">{{ formatTime(totalDuration) }}</span>
                </div>
            </div>

            <div class="row player-buttons">
                <div class="col-5 player-buttons-top">
                    <button @click="toggleRepeat">
                        <img src="@/assets/images/player/repeat.png" alt="repeat-button" />
                    </button>
                    <button @click="playPrev">
                        <img src="@/assets/images/player/prev.png" alt="prev-button" />
                    </button>
                    <button class="play-pause-button" @click="togglePlay">
                        <img
                            :src="isPlaying ? pause : play"
                            :alt="isPlaying ? 'pause-button' : 'play-button'"
                            class="play-pause-img"
                        />
                    </button>
                    <button @click="playNext">
                        <img src="@/assets/images/player/next.png" alt="next-button" />
                    </button>
                    <button @click="toggleShuffle">
                        <img src="@/assets/images/player/shuffle.png" alt="shuffle-button" />
                    </button>
                </div>
            </div>

            <div class="col-3 player-buttons-bottom">
                <button>
                    <img src="../../assets/images/player/like.png" alt="like-button" />
                </button>
                <button>
                    <span>가사</span>
                </button>
                <button>
                    <img src="../../assets/images/player/list.png" alt="list-button" />
                </button>
            </div>
        </section>
    </div>
</template>

<script>
import pause from '@/assets/images/player/pause.png';
import play from '@/assets/images/player/play.png';
import { searchApi } from '@/api/_music_api';

export default {
    name: 'Player',

    data() {
        return {
            pause,
            play,

            tracks: [],
            currentIndex: 0,

            songName: '곡 제목',
            singerName: '가수명',
            albumCover: null,

            totalDuration: 0,
            currentTime: 0,
            isPlaying: false,
            isDragging: false,
            rafId: null,

            isHandleDragging: false,
            handleStartY: 0,
            sheetOffsetY: 0
        };
    },

    computed: {
        currentTrack() {
            return this.tracks[this.currentIndex] ?? null;
        },
        progressPercent() {
            if (!this.totalDuration) return 0;
            return Math.max(0, Math.min(100, (this.currentTime / this.totalDuration) * 100));
        },
        playerWrapStyle() {
            return {
                transform: `translateY(${this.sheetOffsetY}px)`,
                transition: this.isHandleDragging ? 'none' : 'transform 240ms ease'
            };
        }
    },

    async mounted() {
        const term = this.$route.query.term?.trim();
        if (!term) return;

        await this.loadInitialTrack(term);

        window.addEventListener('mousemove', this.onWindowMouseMove);
        window.addEventListener('mouseup', this.onWindowMouseUp);
        window.addEventListener('touchmove', this.onWindowTouchMove, { passive: false });
        window.addEventListener('touchend', this.onWindowTouchEnd);
    },

    beforeUnmount() {
        const audio = this.$refs.audio;
        if (audio) audio.pause();

        if (this.rafId) cancelAnimationFrame(this.rafId);

        window.removeEventListener('mousemove', this.onWindowMouseMove);
        window.removeEventListener('mouseup', this.onWindowMouseUp);
        window.removeEventListener('touchmove', this.onWindowTouchMove);
        window.removeEventListener('touchend', this.onWindowTouchEnd);
    },

    methods: {
        // ─── 초기화 ────────────────────────────────────────────────

        async loadInitialTrack(term) {
            const song = await this.fetchFirstSong(term);
            if (!song) return;

            this.songName = song.trackName;
            this.singerName = song.artistName;
            this.albumCover = song.artworkUrl100 || '';

            const artistTracks = await this.fetchArtistTracks(song.artistName);
            this.tracks = [
                {
                    previewUrl: song.previewUrl,
                    artistName: song.artistName,
                    trackName: song.trackName,
                    albumCover: song.artworkUrl100
                },
                ...artistTracks
            ];
        },

        async fetchFirstSong(term) {
            const { data } = await searchApi({ term, country: 'KR', media: 'music', entity: 'song', limit: 1 });
            return data?.results?.[0] ?? null;
        },

        async fetchArtistTracks(artistName) {
            const { data } = await searchApi({
                term: artistName,
                country: 'KR',
                media: 'music',
                entity: 'song',
                limit: 100
            });
            return (data?.results ?? []).map((t) => ({
                previewUrl: t.previewUrl,
                artistName: t.artistName,
                trackName: t.trackName,
                albumCover: t.artworkUrl100
            }));
        },

        // ─── Audio 이벤트 핸들러 ───────────────────────────────────

        onLoadedMetadata() {
            this.totalDuration = this.$refs.audio?.duration ?? 0;
        },

        onTimeUpdate() {
            if (this.isDragging) return;
            this.currentTime = this.$refs.audio?.currentTime ?? 0;
        },

        async onEnded() {
            this.isPlaying = false;
            this.currentTime = 0;
            await this.playNext();
        },

        // ─── 재생 제어 ─────────────────────────────────────────────

        async togglePlay() {
            const audio = this.$refs.audio;
            if (!audio || !this.currentTrack) return;

            if (audio.paused) {
                try {
                    await audio.play();
                    this.isPlaying = true;
                } catch (e) {
                    console.error('재생 실패:', e);
                }
            } else {
                audio.pause();
                this.isPlaying = false;
            }
        },

        async playNext() {
            if (this.currentIndex >= this.tracks.length - 1) return;

            this.currentIndex++;
            this.updateTrackMeta();

            await this.$nextTick();
            await this.startPlay();
        },

        playPrev() {
            const audio = this.$refs.audio;
            if (!audio) return;

            if (audio.currentTime > 3 || this.currentIndex === 0) {
                audio.currentTime = 0;
                this.currentTime = 0;
            } else {
                this.currentIndex--;
                this.updateTrackMeta();
            }
        },

        toggleRepeat() {
            // TODO: 반복 재생 기능
        },

        toggleShuffle() {
            // TODO: 셔플 기능
        },

        updateTrackMeta() {
            const track = this.currentTrack;
            if (!track) return;
            this.songName = track.trackName;
            this.singerName = track.artistName;
            this.albumCover = track.albumCover ?? this.albumCover;
        },

        async startPlay() {
            const audio = this.$refs.audio;
            if (!audio) return;
            try {
                await audio.play();
                this.isPlaying = true;
            } catch (e) {
                console.error('재생 실패:', e);
            }
        },

        // ─── 진행바 제어 ───────────────────────────────────────────

        onProgressMouseDown(e) {
            this.isDragging = true;
            this.seekFromEvent(e.clientX);
        },

        onWindowMouseMove(e) {
            if (this.isHandleDragging) {
                this.updateSheetOffset(e.clientY);
                return;
            }
            if (!this.isDragging) return;
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this.rafId = requestAnimationFrame(() => this.seekFromEvent(e.clientX));
        },

        onWindowMouseUp() {
            if (this.isHandleDragging) {
                this.finishHandleDrag();
                return;
            }
            this.stopDragging();
        },

        onProgressTouchStart(e) {
            this.isDragging = true;
            this.seekFromEvent(e.touches[0].clientX);
        },

        onWindowTouchMove(e) {
            if (this.isHandleDragging) {
                e.preventDefault();
                this.updateSheetOffset(e.touches[0].clientY);
                return;
            }
            if (!this.isDragging) return;
            e.preventDefault();
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this.rafId = requestAnimationFrame(() => this.seekFromEvent(e.touches[0].clientX));
        },

        onWindowTouchEnd() {
            if (this.isHandleDragging) {
                this.finishHandleDrag();
                return;
            }
            this.stopDragging();
        },

        // ─── 핸들 드래그(페이지 내리기) ────────────────────────────
        onHandleMouseDown(e) {
            if (e.button !== 0) return;
            this.startHandleDrag(e.clientY);
        },

        onHandleTouchStart(e) {
            this.startHandleDrag(e.touches[0].clientY);
        },

        startHandleDrag(startY) {
            this.isHandleDragging = true;
            this.handleStartY = startY;
        },

        updateSheetOffset(currentY) {
            const delta = currentY - this.handleStartY;
            this.sheetOffsetY = Math.max(0, delta);
        },

        finishHandleDrag() {
            const wrapHeight = this.$refs.playerWrap?.offsetHeight || window.innerHeight;
            const threshold = wrapHeight * 0.5;
            const shouldClose = this.sheetOffsetY >= threshold;

            this.isHandleDragging = false;

            if (shouldClose) {
                this.sheetOffsetY = wrapHeight;
                setTimeout(() => this.$router.back(), 220);
                return;
            }

            this.sheetOffsetY = 0;
        },

        stopDragging() {
            if (!this.isDragging) return;
            this.isDragging = false;
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        },

        seekFromEvent(clientX) {
            const bar = this.$refs.progressBar;
            const audio = this.$refs.audio;
            if (!bar || !audio?.duration) return;

            const rect = bar.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            audio.currentTime = ratio * audio.duration;
            this.currentTime = audio.currentTime;
        },

        // ─── 앨범 아트 배경색 ──────────────────────────────────────

        applyBackgroundColor() {
            const img = this.$refs.albumImage;
            const box = this.$refs.artistImgBox;
            if (!img || !box) return;

            try {
                const [r, g, b] = this.getDominantColor(img);
                const makeRgba = (factor, alpha) => {
                    const [rr, gg, bb] = [r, g, b].map((c) => Math.min(255, Math.floor(c * factor)));
                    return `rgba(${rr}, ${gg}, ${bb}, ${alpha})`;
                };

                box.style.background = `linear-gradient(180deg,
                    ${makeRgba(1.15, 0.8)} 0%,
                    ${makeRgba(1.2, 0.75)} 50%,
                    ${makeRgba(1.25, 0.8)} 100%)`;
                box.style.boxShadow = `
                    0 20px 60px rgba(${r}, ${g}, ${b}, 0.5),
                    0 0 100px rgba(${r}, ${g}, ${b}, 0.3)`;
            } catch {
                box.style.background = `linear-gradient(180deg,
                    rgba(253,207,138,0.8) 0%,
                    rgba(255,216,144,0.75) 50%,
                    rgba(255,225,150,0.8) 100%)`;
            }
        },

        getDominantColor(img) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            ctx.drawImage(img, 0, 0);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const radius = Math.min(canvas.width, canvas.height) * 0.25;
            const { data } = ctx.getImageData(cx - radius, cy - radius, radius * 2, radius * 2);

            let r = 0,
                g = 0,
                b = 0,
                count = 0;
            for (let i = 0; i < data.length; i += 4) {
                const [rd, gd, bd] = [data[i], data[i + 1], data[i + 2]];
                if (Math.abs(rd - gd) + Math.abs(gd - bd) + Math.abs(bd - rd) > 30) {
                    r += rd;
                    g += gd;
                    b += bd;
                    count++;
                }
            }

            return count > 0 ? [Math.floor(r / count), Math.floor(g / count), Math.floor(b / count)] : [220, 180, 120];
        },

        // ─── 유틸 ──────────────────────────────────────────────────

        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/player.css"></style>
