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
                <article v-for="track in playlist.tracks" :key="track.id" class="track-item">
                    <img
                        :src="track.artworkUrl100 || fallbackImage"
                        :alt="track.title"
                        class="track-cover"
                        @error="handleImageError"
                    />

                    <div class="track-info">
                        <p class="track-title">{{ track.title }}</p>
                        <p class="track-artist">{{ track.artistName }}</p>
                    </div>

                    <button type="button" class="track-more-btn">
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
import { getLibraryItemById, getLibraryItems, saveLibraryItems } from '@/utils/libraryStorage';
import { searchApi } from '@/api/_music_api';
import { useMusicImageStore } from '@/store/music';

const PLAYER_STATE_KEY = 'mute-player-state';

export default {
    name: 'PlaylistDetailView',
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
                .map((track) => track.artworkUrl100)
                .filter(Boolean)
                .slice(0, 4);

            return covers;
        },
        totalDurationText() {
            const tracks = this.playlist?.tracks || [];
            if (!tracks.length) return '0분 0초';

            let totalSeconds = 0;

            tracks.forEach((track) => {
                if (track.durationMs) {
                    totalSeconds += Math.floor(track.durationMs / 1000);
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

        async enrichTracksWithApi(tracks = []) {
            return Promise.all(
                tracks.map(async (track) => {
                    if (track.artworkUrl100 && track.artistName && track.title) return track;

                    try {
                        const { data } = await searchApi({
                            term: `${track.artistName || ''} ${track.title || ''}`.trim(),
                            country: 'KR',
                            media: 'music',
                            entity: 'song',
                            limit: 1
                        });

                        const hit = data?.results?.[0];

                        return {
                            ...track,
                            title: hit?.trackName || track.title,
                            artistName: hit?.artistName || track.artistName,
                            artworkUrl100:
                                this.upgradeArtwork(hit?.artworkUrl100 || '', 600) || track.artworkUrl100 || '',
                            durationMs: track.durationMs || hit?.trackTimeMillis || 0,
                            durationText: track.durationText || this.formatDuration(hit?.trackTimeMillis),
                            previewUrl: hit?.previewUrl || ''
                        };
                    } catch (error) {
                        console.error('enrichTracksWithApi error:', error);
                        return track;
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
                    title: hit.trackName || keyword.trim(),
                    artistName: hit.artistName || '',
                    artworkUrl100: this.upgradeArtwork(hit.artworkUrl100 || '', 600) || '',
                    durationMs: hit.trackTimeMillis || 0,
                    durationText: this.formatDuration(hit.trackTimeMillis || 0),
                    previewUrl: hit.previewUrl || ''
                };

                const duplicated = (this.playlist.tracks || []).some(
                    (track) =>
                        String(track.id) === String(newTrack.id) ||
                        (track.title || '').trim().toLowerCase() === newTrack.title.trim().toLowerCase() &&
                            (track.artistName || '').trim().toLowerCase() === newTrack.artistName.trim().toLowerCase()
                );
                if (duplicated) {
                    alert('이미 추가된 곡입니다.');
                    return;
                }

                const updatedPlaylist = {
                    ...this.playlist,
                    tracks: [...(this.playlist.tracks || []), newTrack]
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
                    artistName: track?.artistName || '',
                    trackName: track?.title || track?.trackName || '',
                    albumCover: this.upgradeArtwork(track?.artworkUrl100 || '', 600) || this.fallbackImage
                }))
                .filter((track) => track.trackName);
        },
        startPlayback(tracks = []) {
            if (!tracks.length) {
                alert('재생할 곡이 없습니다.');
                return;
            }

            let currentIndex = 0;
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
            this.startPlayback(this.buildPlayerTracks());
        },
        playShuffleTracks() {
            const tracks = [...this.buildPlayerTracks()];
            for (let i = tracks.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
            }
            this.startPlayback(tracks);
        },

        persistPlaylist(updatedPlaylist) {
            const items = getLibraryItems();
            const updatedItems = items.map((item) => {
                if (String(item.id) === String(updatedPlaylist.id)) {
                    return updatedPlaylist;
                }
                return item;
            });

            saveLibraryItems(updatedItems);
        },

        async loadPlaylist() {
            const id = this.$route.params.id;
            const item = getLibraryItemById(id);

            if (!item || item.type !== 'playlist') {
                this.playlist = null;
                return;
            }

            const enrichedTracks = await this.enrichTracksWithApi(item.tracks || []);

            this.playlist = {
                ...item,
                coverImage: item.coverImage || '',
                tracks: enrichedTracks
            };
        }
    },
    mounted() {
        this.loadPlaylist();
    },
    watch: {
        '$route.params.id'() {
            this.loadPlaylist();
        }
    }
};
</script>

<style scoped>
.playlist-detail-page {
    padding: 16px;
}

.top-area {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.top-cover-wrap {
    width: 100%;
    max-width: 320px;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: #d9d9d9;
    margin-bottom: 20px;
}

.single-cover,
.empty-cover {
    width: 100%;
    height: 100%;
    display: block;
}

.single-cover {
    object-fit: cover;
}

.empty-cover {
    background: #d9d9d9;
}

.collage-cover {
    width: 100%;
    height: 100%;
    display: grid;
    gap: 0;
}

.collage-cover.count-1 {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
}

.collage-cover.count-2 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
}

.collage-cover.count-3,
.collage-cover.count-4 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
}

.collage-cell {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #d9d9d9;
}

.collage-cell img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.playlist-summary {
    text-align: center;
}

.playlist-type,
.playlist-meta {
    margin: 0 0 6px;
}

.playlist-title {
    margin: 0 0 8px;
}

.action-row {
    display: flex;
    gap: 12px;
    margin: 24px 0 12px;
}

.action-btn {
    flex: 1;
    height: 44px;
    border: 1px solid #d7dbe8;
    background: #fff;
    border-radius: 8px;
}

.add-row {
    margin-bottom: 20px;
}

.add-music-btn {
    width: 100%;
    height: 44px;
    border: 1px dashed #b9c4e3;
    background: #fff;
    color: #4d6bb3;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
}

.track-section {
    margin-top: 12px;
}

.section-title {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 700;
    color: #111;
}

.track-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.track-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.track-cover {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 6px;
    background: #d9d9d9;
}

.track-info {
    flex: 1;
    min-width: 0;
}

.track-title {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 600;
    color: #111;
}

.track-artist {
    margin: 0;
    font-size: 12px;
    color: #666;
}

.track-more-btn {
    width: 32px;
    height: 32px;
    border: 0;
    background: transparent;
}

.empty-track-box {
    padding: 20px 0;
    color: #888;
    text-align: center;
}
</style>
