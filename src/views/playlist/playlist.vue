<template>
    <section class="container playlist-detail-page" v-if="playlist">
        <div class="top-area">
            <div class="top-cover-wrap">
                <!-- 직접 커버가 있으면 1장 -->
                <img
                    v-if="playlist.coverImage"
                    class="single-cover"
                    :src="playlist.coverImage || fallbackImage"
                    :alt="playlist.title"
                    @error="handleImageError"
                />

                <!-- 직접 커버 없고, 곡이 있으면 분할 커버 -->
                <div v-else-if="collageImages.length" class="collage-cover" :class="`count-${collageImages.length}`">
                    <div v-for="(cover, index) in collageImages" :key="index" class="collage-cell">
                        <img :src="cover" :alt="`${playlist.title}-${index}`" @error="handleImageError" />
                    </div>
                </div>

                <!-- 곡이 하나도 없으면 회색 박스 -->
                <div v-else class="empty-cover"></div>
            </div>

            <div class="playlist-summary">
                <p class="playlist-type">플레이리스트</p>
                <h2 class="playlist-title">{{ playlist.title }}</h2>
                <p class="playlist-meta">제작자 · {{ playlist.owner }}</p>
                <p class="playlist-meta">{{ playlist.tracks?.length || 0 }}곡 · {{ totalDurationText }}</p>
            </div>
        </div>

        <div class="action-row">
            <button type="button" class="action-btn" @click="playShuffleTracks">셔플듣기</button>
            <button type="button" class="action-btn" @click="playAllTracks">전체듣기</button>
        </div>

        <div class="add-row">
            <button type="button" class="add-music-btn" @click="addMusicToPlaylist">+ 음악 추가하기</button>
        </div>

        <div class="track-section">
            <h3 class="section-title">수록곡</h3>

            <div v-if="playlist.tracks?.length" class="track-list">
                <article
                    v-for="(track, index) in playlist.tracks"
                    :key="track.id || track.trackId || index"
                    class="track-item"
                    @click="playTrackFromIndex(index)"
                >
                    <img
                        :src="getTrackCover(track)"
                        :alt="getTrackTitle(track)"
                        class="track-cover"
                        @error="handleImageError"
                    />

                    <div class="track-info">
                        <p class="track-title">{{ getTrackTitle(track) }}</p>
                        <p class="track-artist">{{ getTrackArtist(track) }}</p>
                    </div>

                    <button type="button" class="track-more-btn" @click.stop>
                        <span class="material-symbols-outlined">more_vert</span>
                    </button>
                </article>
            </div>

            <div v-else class="empty-track-box">
                <p>아직 추가된 음악이 없습니다.</p>
            </div>
        </div>
    </section>

    <section v-else class="container playlist-detail-page">
        <p>플레이리스트를 불러오지 못했습니다.</p>
    </section>
</template>

<script>
import { searchApi } from '@/api/_music_api';
import { useMusicImageStore } from '@/store/music';

const MY_PLAYLIST_KEY = 'my-playlist';
const PLAYER_STATE_KEY = 'mute-player-state';

export default {
    name: 'PlayList',
    data() {
        return {
            playlist: null,
            fallbackImage: require('@/assets/images/player/player-img1.png'),
            musicImageStore: useMusicImageStore()
        };
    },
    computed: {
        collageImages() {
            const covers = (this.playlist?.tracks || [])
                .map((track) => this.getTrackCover(track))
                .filter(Boolean)
                .slice(0, 4);

            return covers;
        },
        totalDurationText() {
            const tracks = this.playlist?.tracks || [];
            if (!tracks.length) return '0분 0초';

            let totalSeconds = 0;

            tracks.forEach((track) => {
                if (track.durationMs || track.trackTimeMillis) {
                    totalSeconds += Math.floor((track.durationMs || track.trackTimeMillis) / 1000);
                    return;
                }

                const [min, sec] = (track.durationText || '0:00').split(':').map(Number);
                totalSeconds += (min || 0) * 60 + (sec || 0);
            });

            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            if (hours > 0) {
                return `${hours}시간 ${minutes}분 ${seconds}초`;
            }

            return `${minutes}분 ${seconds}초`;
        }
    },
    methods: {
        upgradeArtwork(url = '', size = 600) {
            return this.musicImageStore.upgradeArtwork(url, size);
        },

        formatDuration(ms) {
            if (!ms) return '0:00';

            const totalSeconds = Math.floor(ms / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            return `${minutes}:${String(seconds).padStart(2, '0')}`;
        },

        handleImageError(event) {
            event.target.src = this.fallbackImage;
        },

        getTrackTitle(track) {
            return track?.title || track?.trackName || '제목 없음';
        },

        getTrackArtist(track) {
            return track?.artistName || '아티스트 정보 없음';
        },

        getTrackCover(track) {
            return (
                this.upgradeArtwork(track?.artworkUrl100 || track?.albumCover || '', 600) ||
                track?.artworkUrl100 ||
                track?.albumCover ||
                this.fallbackImage
            );
        },

        normalizePlaylistData(saved) {
            if (Array.isArray(saved)) {
                return {
                    id: 'my-playlist',
                    type: 'playlist',
                    title: '최근 들은 곡',
                    owner: '작성자',
                    coverImage: '',
                    tracks: saved
                };
            }

            return {
                id: saved?.id || 'my-playlist',
                type: 'playlist',
                title: saved?.title || '최근 들은 곡',
                owner: saved?.owner || '작성자',
                coverImage: saved?.coverImage || '',
                tracks: Array.isArray(saved?.tracks) ? saved.tracks : []
            };
        },

        async enrichTracksWithApi(tracks = []) {
            return Promise.all(
                tracks.map(async (track) => {
                    if (
                        (track.artworkUrl100 || track.albumCover) &&
                        track.artistName &&
                        (track.title || track.trackName)
                    ) {
                        return {
                            ...track,
                            title: track.title || track.trackName,
                            trackName: track.trackName || track.title,
                            artworkUrl100: track.artworkUrl100 || track.albumCover,
                            albumCover: track.albumCover || track.artworkUrl100
                        };
                    }

                    try {
                        const { data } = await searchApi({
                            term: `${track.artistName || ''} ${track.title || track.trackName || ''}`.trim(),
                            country: 'KR',
                            media: 'music',
                            entity: 'song',
                            limit: 1
                        });

                        const hit = data?.results?.[0];

                        return {
                            ...track,
                            id: String(track.id || track.trackId || hit?.trackId || Date.now()),
                            trackId: String(track.trackId || track.id || hit?.trackId || Date.now()),
                            title: hit?.trackName || track.title || track.trackName,
                            trackName: hit?.trackName || track.trackName || track.title,
                            artistName: hit?.artistName || track.artistName,
                            artworkUrl100:
                                this.upgradeArtwork(hit?.artworkUrl100 || '', 600) ||
                                track.artworkUrl100 ||
                                track.albumCover ||
                                '',
                            albumCover:
                                this.upgradeArtwork(hit?.artworkUrl100 || '', 600) ||
                                track.albumCover ||
                                track.artworkUrl100 ||
                                '',
                            durationMs: track.durationMs || hit?.trackTimeMillis || 0,
                            trackTimeMillis: track.trackTimeMillis || hit?.trackTimeMillis || 0,
                            durationText:
                                track.durationText ||
                                this.formatDuration(track.durationMs || track.trackTimeMillis || hit?.trackTimeMillis),
                            previewUrl: hit?.previewUrl || track.previewUrl || ''
                        };
                    } catch (error) {
                        console.error('enrichTracksWithApi error:', error);
                        return {
                            ...track,
                            id: String(track.id || track.trackId || Date.now()),
                            trackId: String(track.trackId || track.id || Date.now()),
                            title: track.title || track.trackName || '제목 없음',
                            trackName: track.trackName || track.title || '제목 없음',
                            artistName: track.artistName || '',
                            artworkUrl100: track.artworkUrl100 || track.albumCover || '',
                            albumCover: track.albumCover || track.artworkUrl100 || '',
                            durationMs: track.durationMs || track.trackTimeMillis || 0,
                            trackTimeMillis: track.trackTimeMillis || track.durationMs || 0,
                            durationText:
                                track.durationText ||
                                this.formatDuration(track.durationMs || track.trackTimeMillis || 0),
                            previewUrl: track.previewUrl || ''
                        };
                    }
                })
            );
        },

        async addMusicToPlaylist() {
            const keyword = window.prompt('추가할 음악 제목이나 가수명을 입력해주세요.');

            if (!keyword || !keyword.trim()) return;

            try {
                const { data } = await searchApi({
                    term: keyword.trim(),
                    country: 'KR',
                    media: 'music',
                    entity: 'song',
                    limit: 10
                });

                const hits = data?.results || [];

                if (!hits.length) {
                    alert('검색 결과가 없습니다.');
                    return;
                }

                const optionsText = hits
                    .slice(0, 10)
                    .map((item, index) => `${index + 1}. ${item.trackName || '-'} - ${item.artistName || '-'}`)
                    .join('\n');

                const selected = window.prompt(
                    `추가할 곡 번호를 입력해주세요.\n\n${optionsText}\n\n(예: 1, 취소: 빈값)`
                );

                if (!selected || !selected.trim()) return;

                const selectedIndex = Number(selected) - 1;
                if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= hits.length) {
                    alert('올바른 번호를 입력해주세요.');
                    return;
                }

                const hit = hits[selectedIndex];
                const newTrack = {
                    id: String(hit.trackId || Date.now()),
                    trackId: String(hit.trackId || Date.now()),
                    title: hit.trackName || keyword.trim(),
                    trackName: hit.trackName || keyword.trim(),
                    artistName: hit.artistName || '',
                    artworkUrl100: this.upgradeArtwork(hit.artworkUrl100 || '', 600) || '',
                    albumCover: this.upgradeArtwork(hit.artworkUrl100 || '', 600) || '',
                    durationMs: hit.trackTimeMillis || 0,
                    trackTimeMillis: hit.trackTimeMillis || 0,
                    durationText: this.formatDuration(hit.trackTimeMillis || 0),
                    previewUrl: hit.previewUrl || ''
                };

                const duplicated = (this.playlist?.tracks || []).some(
                    (track) =>
                        String(track.id || track.trackId) === String(newTrack.id) ||
                        ((this.getTrackTitle(track) || '').trim().toLowerCase() ===
                            newTrack.title.trim().toLowerCase() &&
                            (this.getTrackArtist(track) || '').trim().toLowerCase() ===
                                newTrack.artistName.trim().toLowerCase())
                );

                if (duplicated) {
                    alert('이미 추가된 곡입니다.');
                    return;
                }

                const updatedPlaylist = {
                    ...this.playlist,
                    tracks: [...(this.playlist?.tracks || []), newTrack]
                };

                this.playlist = updatedPlaylist;
                this.persistPlaylist(updatedPlaylist);
            } catch (error) {
                console.error('addMusicToPlaylist error:', error);
                alert('음악 추가 중 오류가 발생했습니다.');
            }
        },

        buildPlayerTracks() {
            return (this.playlist?.tracks || [])
                .map((track) => ({
                    previewUrl: track?.previewUrl || '',
                    artistName: this.getTrackArtist(track),
                    trackName: this.getTrackTitle(track),
                    albumCover: this.getTrackCover(track)
                }))
                .filter((track) => track.trackName);
        },

        startPlayback(tracks = [], initialIndex = 0) {
            if (!tracks.length) {
                alert('재생할 곡이 없습니다.');
                return;
            }

            let currentIndex = Number.isInteger(initialIndex) ? initialIndex : 0;
            if (currentIndex < 0 || currentIndex >= tracks.length) currentIndex = 0;

            if (!tracks[currentIndex]?.previewUrl) {
                const playableIndex = tracks.findIndex((track, index) => index >= currentIndex && !!track.previewUrl);
                if (playableIndex >= 0) currentIndex = playableIndex;
            }

            if (!tracks[currentIndex]?.previewUrl) {
                const playableIndex = tracks.findIndex((track) => !!track.previewUrl);
                if (playableIndex >= 0) currentIndex = playableIndex;
            }

            const currentTrack = tracks[currentIndex] || tracks[0];
            const payload = {
                tracks,
                currentIndex,
                songName: currentTrack?.trackName || '',
                singerName: currentTrack?.artistName || '',
                albumCover: currentTrack?.albumCover || '',
                totalDuration: 0,
                isPlaying: true,
                miniVisible: false,
                playerPath: `/main/player/${currentIndex}`,
                updatedAt: Date.now()
            };

            localStorage.setItem(PLAYER_STATE_KEY, JSON.stringify(payload));
            window.dispatchEvent(new CustomEvent('mute-player-state-updated', { detail: payload }));
            this.$router.push({ path: `/main/player/${currentIndex}` });
        },

        playAllTracks() {
            this.startPlayback(this.buildPlayerTracks(), 0);
        },

        playTrackFromIndex(index) {
            this.startPlayback(this.buildPlayerTracks(), index);
        },

        playShuffleTracks() {
            const tracks = [...this.buildPlayerTracks()];
            for (let i = tracks.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
            }
            this.startPlayback(tracks, 0);
        },

        persistPlaylist(updatedPlaylist) {
            localStorage.setItem(MY_PLAYLIST_KEY, JSON.stringify(updatedPlaylist));
            window.dispatchEvent(new CustomEvent('my-playlist-updated', { detail: updatedPlaylist }));
        },

        async loadPlaylist(payload = null) {
            try {
                const raw = payload ?? JSON.parse(localStorage.getItem(MY_PLAYLIST_KEY) || '{}');

                const normalized = this.normalizePlaylistData(raw);
                const enrichedTracks = await this.enrichTracksWithApi(normalized.tracks || []);

                this.playlist = {
                    ...normalized,
                    tracks: enrichedTracks
                };
            } catch (error) {
                console.error('loadPlaylist error:', error);
                this.playlist = null;
            }
        },

        onMyPlaylistUpdated(event) {
            if (event?.detail) {
                this.loadPlaylist(event.detail);
                return;
            }
            this.loadPlaylist();
        },

        onStorageUpdated(event) {
            if (event?.key !== MY_PLAYLIST_KEY) return;
            this.loadPlaylist();
        }
    },
    mounted() {
        this.loadPlaylist();
        window.addEventListener('my-playlist-updated', this.onMyPlaylistUpdated);
        window.addEventListener('storage', this.onStorageUpdated);
    },
    beforeUnmount() {
        window.removeEventListener('my-playlist-updated', this.onMyPlaylistUpdated);
        window.removeEventListener('storage', this.onStorageUpdated);
    }
};
</script>

<style scoped src="@/assets/styles/pages/playlist.css"></style>
