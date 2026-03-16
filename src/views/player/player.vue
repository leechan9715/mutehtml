<template>
    <h2 class="hidden">플레이어</h2>
    <div
        id="player-wrap"
        :class="{ 'overlay-mode': overlayMode }"
        ref="playerWrap"
        :style="playerWrapStyle"
        @mousedown="onSheetAreaMouseDown"
        @touchstart.passive="onSheetAreaTouchStart"
    >
        <section class="container album-cover" ref="artistImgBox">
            <!-- <div class="row down-handle">
                <img
                    src="@/assets/images/popupdown/slidedown.png"
                    alt="slidedowns"
                    :class="{ 'is-grabbing': isHandleDragging }"
                    @mousedown.prevent="onHandleMouseDown"
                    @touchstart.prevent="onHandleTouchStart"
                />
            </div> -->
            <div class="row player-img">
                <div class="col-1">
                    <div
                        class="artist-img"
                        :style="coverSwipeStyle"
                        @mousedown.stop.prevent="onCoverMouseDown"
                        @touchstart.stop.prevent="onCoverTouchStart"
                    >
                        <img
                            :src="albumCover"
                            alt="player-img1"
                            crossorigin="anonymous"
                            ref="albumImage"
                            @load="applyBackgroundColor"
                            @click.prevent.stop
                            @contextmenu.prevent.stop
                            @dragstart.prevent
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
                    <button class="play-pause-button" data-no-sheet-drag @click="togglePlay">
                        <img
                            :src="isPlaying ? pause : play"
                            :alt="isPlaying ? 'pause-button' : 'play-button'"
                            class="play-pause-img"
                        />
                    </button>
                    <button data-no-sheet-drag @click="playNext">
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

const PLAYER_STATE_KEY = 'mute-player-state';
const MY_PLAYLIST_KEY = 'my-playlist';

export default {
    name: 'Player',
    props: {
        overlayMode: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close'],

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
            sheetOffsetY: 0,

            isCoverSwiping: false,
            coverStartX: 0,
            coverStartY: 0,
            coverDeltaX: 0,
            coverDeltaY: 0,
            coverGestureMode: 'undecided',
            lastPersistAt: 0,
            persistIntervalMs: 2000,
            miniVisible: false,
            keepPlayingOnMini: false,
            globalDragEventsBound: false
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
        },
        coverSwipeStyle() {
            const offset = this.isCoverSwiping ? this.coverDeltaX : 0;
            return {
                transform: `translateX(${offset}px)`,
                transition: this.isCoverSwiping ? 'none' : 'transform 180ms ease'
            };
        }
    },

    async mounted() {
        this.miniVisible = false;
        this.keepPlayingOnMini = false;

        const initialOffset = window.innerHeight || document.documentElement.clientHeight || 0;
        this.sheetOffsetY = initialOffset;
        this.$nextTick(() => {
            requestAnimationFrame(() => {
                this.sheetOffsetY = 0;
            });
        });

        const term = this.overlayMode ? '' : this.$route.query.term?.trim();
        if (!term) {
            await this.restoreFromSavedState();
            return;
        }

        await this.loadInitialTrack(term);
    },

    beforeUnmount() {
        const audio = this.$refs.audio;
        const shouldHandoffToMini = this.overlayMode && this.isPlaying && !this.keepPlayingOnMini;

        if (shouldHandoffToMini) {
            const handoffTime = audio?.currentTime ?? this.currentTime ?? 0;
            this.currentTime = handoffTime;
            this.savePlayerState({ miniVisible: true, isPlaying: true });
            window.dispatchEvent(
                new CustomEvent('mute-player-request-mini-resume', { detail: { currentTime: handoffTime } })
            );
            if (audio) audio.pause();
        } else {
            this.savePlayerState();
            if (audio && !this.keepPlayingOnMini) audio.pause();
        }

        if (this.rafId) cancelAnimationFrame(this.rafId);

        this.unbindGlobalDragEvents();
    },

    methods: {
        bindGlobalDragEvents() {
            if (this.globalDragEventsBound) return;
            window.addEventListener('mousemove', this.onWindowMouseMove);
            window.addEventListener('mouseup', this.onWindowMouseUp);
            window.addEventListener('touchmove', this.onWindowTouchMove, { passive: false });
            window.addEventListener('touchend', this.onWindowTouchEnd);
            window.addEventListener('touchcancel', this.onWindowTouchEnd);
            this.globalDragEventsBound = true;
        },

        unbindGlobalDragEvents() {
            if (!this.globalDragEventsBound) return;
            window.removeEventListener('mousemove', this.onWindowMouseMove);
            window.removeEventListener('mouseup', this.onWindowMouseUp);
            window.removeEventListener('touchmove', this.onWindowTouchMove);
            window.removeEventListener('touchend', this.onWindowTouchEnd);
            window.removeEventListener('touchcancel', this.onWindowTouchEnd);
            this.globalDragEventsBound = false;
        },

        maybeReleaseGlobalDragEvents() {
            if (this.isDragging || this.isHandleDragging || this.isCoverSwiping) return;
            this.unbindGlobalDragEvents();
        },

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

            this.savePlayerState({ miniVisible: false });
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
            this.savePlayerState();
        },

        onTimeUpdate() {
            if (this.isDragging) return;
            this.currentTime = this.$refs.audio?.currentTime ?? 0;

            const now = Date.now();
            if (now - this.lastPersistAt > this.persistIntervalMs) {
                this.lastPersistAt = now;
                this.savePlayerState({}, false);
            }
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
                    this.appendCurrentTrackToMyPlaylist();
                    this.savePlayerState();
                } catch (e) {
                    console.error('재생 실패:', e);
                }
            } else {
                audio.pause();
                this.isPlaying = false;
                this.savePlayerState();
            }
        },

        async playNext() {
            if (!this.tracks.length) return;

            const isLastTrack = this.currentIndex >= this.tracks.length - 1;
            this.currentIndex = isLastTrack ? 0 : this.currentIndex + 1;
            this.updateTrackMeta();

            await this.$nextTick();
            const audio = this.$refs.audio;
            if (audio) {
                audio.currentTime = 0;
                audio.load();
            }
            await this.startPlay();
            this.savePlayerState();
        },

        async playPrev() {
            const audio = this.$refs.audio;
            if (!audio) return;

            if (audio.currentTime > 3 || this.currentIndex === 0) {
                audio.currentTime = 0;
                this.currentTime = 0;
            } else {
                this.currentIndex--;
                this.updateTrackMeta();
                if (this.isPlaying) {
                    await this.$nextTick();
                    audio.currentTime = 0;
                    audio.load();
                    await this.startPlay();
                }
            }

            this.savePlayerState();
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
            this.currentTime = 0;
            this.totalDuration = 0;
            this.savePlayerState();
        },

        async startPlay() {
            const audio = this.$refs.audio;
            if (!audio) return;
            try {
                let handoffTime = null;
                if (this.overlayMode) {
                    window.dispatchEvent(
                        new CustomEvent('mute-player-request-mini-handoff', {
                            detail: {
                                consume: (time) => {
                                    handoffTime = time;
                                }
                            }
                        })
                    );
                    if (Number.isFinite(handoffTime) && Math.abs(audio.currentTime - handoffTime) > 0.2) {
                        audio.currentTime = handoffTime;
                        this.currentTime = handoffTime;
                    }
                }
                await audio.play();
                this.isPlaying = true;
                this.appendCurrentTrackToMyPlaylist();
                this.savePlayerState();
            } catch (e) {
                console.error('재생 실패:', e);
            }
        },

        // ─── 진행바 제어 ───────────────────────────────────────────

        onProgressMouseDown(e) {
            this.bindGlobalDragEvents();
            this.isDragging = true;
            this.seekFromEvent(e.clientX);
        },

        onWindowMouseMove(e) {
            if (this.isCoverSwiping) {
                this.updateCoverSwipe(e.clientX, e.clientY);
                return;
            }
            if (this.isHandleDragging) {
                this.updateSheetOffset(e.clientY);
                return;
            }
            if (!this.isDragging) return;
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this.rafId = requestAnimationFrame(() => this.seekFromEvent(e.clientX));
        },

        onWindowMouseUp() {
            if (this.isCoverSwiping) {
                this.finishCoverSwipe();
                return;
            }
            if (this.isHandleDragging) {
                this.finishHandleDrag();
                return;
            }
            this.stopDragging();
        },

        onProgressTouchStart(e) {
            this.bindGlobalDragEvents();
            this.isDragging = true;
            this.seekFromEvent(e.touches[0].clientX);
        },

        onWindowTouchMove(e) {
            if (this.isCoverSwiping) {
                e.preventDefault();
                this.updateCoverSwipe(e.touches[0].clientX, e.touches[0].clientY);
                return;
            }
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
            if (this.isCoverSwiping) {
                this.finishCoverSwipe();
                return;
            }
            if (this.isHandleDragging) {
                this.finishHandleDrag();
                return;
            }
            this.stopDragging();
        },

        onCoverMouseDown(e) {
            if (e.button !== 0) return;
            this.startCoverSwipe(e.clientX, e.clientY);
        },

        onCoverTouchStart(e) {
            this.startCoverSwipe(e.touches[0].clientX, e.touches[0].clientY);
        },

        startCoverSwipe(startX, startY) {
            this.bindGlobalDragEvents();
            this.isCoverSwiping = true;
            this.coverStartX = startX;
            this.coverStartY = startY;
            this.coverDeltaX = 0;
            this.coverDeltaY = 0;
            this.coverGestureMode = 'undecided';
        },

        updateCoverSwipe(currentX, currentY) {
            this.coverDeltaX = currentX - this.coverStartX;
            this.coverDeltaY = currentY - this.coverStartY;

            if (this.coverGestureMode === 'undecided') {
                const absX = Math.abs(this.coverDeltaX);
                const absY = Math.abs(this.coverDeltaY);

                if (absX < 6 && absY < 6) return;

                // 앨범커버를 아래로 당기면 시트 드래그로 전환
                if (this.coverDeltaY > 0 && absY > absX) {
                    this.coverGestureMode = 'vertical';
                    this.isCoverSwiping = false;
                    this.startHandleDrag(this.coverStartY);
                    this.updateSheetOffset(currentY);
                    return;
                }

                // 그 외는 좌우 스와이프로 간주
                this.coverGestureMode = 'horizontal';
            }
        },

        async finishCoverSwipe() {
            if (!this.isCoverSwiping) return;

            const dx = this.coverDeltaX;
            const dy = this.coverDeltaY;
            const isHorizontal = this.coverGestureMode === 'horizontal' && Math.abs(dx) > Math.abs(dy);
            const shouldNext = isHorizontal && dx <= -80;
            const shouldPrev = isHorizontal && dx >= 80;

            this.isCoverSwiping = false;
            this.coverStartX = 0;
            this.coverStartY = 0;
            this.coverDeltaX = 0;
            this.coverDeltaY = 0;
            this.coverGestureMode = 'undecided';
            this.maybeReleaseGlobalDragEvents();

            if (shouldNext) {
                await this.playNext();
                return;
            }

            if (shouldPrev) {
                const prevIndex = this.currentIndex;
                this.playPrev();

                // 인덱스가 실제로 이전 곡으로 이동했으면 재생 상태를 이어간다.
                if (this.currentIndex !== prevIndex && this.isPlaying) {
                    await this.$nextTick();
                    await this.startPlay();
                }
            }
        },

        // ─── 핸들 드래그(페이지 내리기) ────────────────────────────
        onHandleMouseDown(e) {
            if (e.button !== 0) return;
            this.startHandleDrag(e.clientY);
        },

        onHandleTouchStart(e) {
            this.startHandleDrag(e.touches[0].clientY);
        },

        onSheetAreaMouseDown(e) {
            if (e.button !== 0) return;
            if (!this.canStartSheetDragFrom(e.target)) return;
            this.startHandleDrag(e.clientY);
        },

        onSheetAreaTouchStart(e) {
            if (!this.canStartSheetDragFrom(e.target)) return;
            this.startHandleDrag(e.touches[0].clientY);
        },

        canStartSheetDragFrom(target) {
            if (!target?.closest) return false;

            // down-handle은 기존 전용 핸들 로직을 사용
            if (target.closest('.down-handle')) return false;

            // 앨범커버 영역은 좌우 스와이프 제스처 우선
            if (target.closest('.artist-img')) return false;

            // 재생/다음곡 버튼은 기존 클릭 동작 유지
            if (target.closest('[data-no-sheet-drag]')) return false;

            // 진행바 드래그는 시크 동작 유지
            if (target.closest('.progress-bar')) return false;

            return true;
        },

        startHandleDrag(startY) {
            this.bindGlobalDragEvents();
            this.isHandleDragging = true;
            this.handleStartY = startY;
        },

        updateSheetOffset(currentY) {
            const delta = currentY - this.handleStartY;
            this.sheetOffsetY = Math.max(0, delta);
        },

        finishHandleDrag() {
            const wrapHeight = this.$refs.playerWrap?.offsetHeight || window.innerHeight;
            const threshold = wrapHeight * 0.2;
            const shouldClose = this.sheetOffsetY >= threshold;

            this.isHandleDragging = false;

            if (shouldClose) {
                const audio = this.$refs.audio;
                const handoffTime = audio?.currentTime ?? this.currentTime ?? 0;
                this.isPlaying = !(audio?.paused ?? true);
                this.sheetOffsetY = wrapHeight;
                this.miniVisible = true;
                this.keepPlayingOnMini = true;
                this.currentTime = handoffTime;
                this.savePlayerState({ miniVisible: true, isPlaying: this.isPlaying });
                if (this.isPlaying && audio) {
                    audio.pause();
                }
                window.dispatchEvent(
                    new CustomEvent('mute-player-request-mini-resume', { detail: { currentTime: handoffTime } })
                );

                const closeDelay = this.overlayMode ? 0 : 220;
                setTimeout(() => {
                    if (this.overlayMode) {
                        this.$emit('close');
                        return;
                    }
                    this.$router.back();
                }, closeDelay);
                this.maybeReleaseGlobalDragEvents();
                return;
            }

            this.sheetOffsetY = 0;
            this.maybeReleaseGlobalDragEvents();
        },

        stopDragging() {
            if (!this.isDragging) return;
            this.isDragging = false;
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
            this.maybeReleaseGlobalDragEvents();
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
        },

        appendCurrentTrackToMyPlaylist() {
            const track = this.currentTrack;
            if (!track) return;

            const playlistItem = {
                previewUrl: track.previewUrl || '',
                trackName: track.trackName || this.songName || '',
                artistName: track.artistName || this.singerName || '',
                albumCover: track.albumCover || this.albumCover || '',
                playedAt: Date.now()
            };

            try {
                const raw = localStorage.getItem(MY_PLAYLIST_KEY);
                const playlist = raw ? JSON.parse(raw) : [];
                const nextPlaylist = Array.isArray(playlist) ? [...playlist, playlistItem] : [playlistItem];
                localStorage.setItem(MY_PLAYLIST_KEY, JSON.stringify(nextPlaylist));
            } catch (e) {
                console.error('my-playlist 저장 실패:', e);
            }
        },

        savePlayerState(override = {}, force = true) {
            const now = Date.now();
            if (!force && now - this.lastPersistAt < this.persistIntervalMs) return;
            const payload = {
                tracks: this.tracks,
                currentIndex: this.currentIndex,
                songName: this.songName,
                singerName: this.singerName,
                albumCover: this.albumCover,
                totalDuration: this.totalDuration,
                isPlaying: this.isPlaying,
                miniVisible: this.miniVisible,
                playerPath: this.buildPlayerPath(),
                updatedAt: now,
                ...override
            };
            localStorage.setItem(PLAYER_STATE_KEY, JSON.stringify(payload));
            window.dispatchEvent(new CustomEvent('mute-player-state-updated', { detail: payload }));
            this.lastPersistAt = now;
        },

        buildPlayerPath() {
            const id = this.currentIndex || 0;
            const term = this.$route.query?.term;
            if (!term) return `/main/player/${id}`;
            return `/main/player/${id}?term=${encodeURIComponent(term)}`;
        },

        async restoreFromSavedState() {
            try {
                const raw = localStorage.getItem(PLAYER_STATE_KEY);
                if (!raw) return;
                const saved = JSON.parse(raw);
                if (!saved?.tracks?.length) return;

                this.tracks = saved.tracks;
                this.currentIndex = saved.currentIndex ?? 0;
                this.songName = saved.songName ?? this.songName;
                this.singerName = saved.singerName ?? this.singerName;
                this.albumCover = saved.albumCover ?? this.albumCover;
                this.currentTime = 0;
                this.isPlaying = !!saved.isPlaying;

                await this.$nextTick();
                const audio = this.$refs.audio;
                if (!audio || !this.currentTrack?.previewUrl) return;

                audio.currentTime = 0;
                if (this.isPlaying) {
                    await this.startPlay();
                }
            } catch (e) {
                console.error('플레이어 상태 복원 실패:', e);
            }
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/player.css"></style>
