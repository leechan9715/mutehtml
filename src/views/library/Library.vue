<template>
    <section class="container library-page">
        <div class="row library-header">
            <div class="recent-box">
                <p>최근에 추가한 보관함</p>
                <img src="@/assets/images/icon/down-arrow.png" alt="down-button" />
            </div>

            <button type="button" class="grid-btn">
                <img src="@/assets/images/icon/grid.png" alt="grid-button" />
            </button>
        </div>

        <div class="row library-list">
            <LibraryItem v-for="item in libraryItems" :key="item.id" :item="item" />

            <button type="button" class="add-playlist-btn" @click="addPlaylist">+ 플레이리스트 추가하기</button>
        </div>
    </section>
</template>

<script>
import LibraryItem from '@/components/layout/LibraryItem.vue';
import { saveLibraryItems, getLibraryItems } from '@/utils/libraryStorage';
import { searchApi } from '@/api/_music_api';

export default {
    name: 'Library',
    components: {
        LibraryItem
    },
    data() {
        return {
            libraryItems: [],
            fallbackImage: require('@/assets/images/player/player-img1.png'),
            fallbackArtistImage: require('@/assets/images/artist-select/1.png')
        };
    },
    methods: {
        getCurrentUsername() {
            try {
                const loginCheck = JSON.parse(localStorage.getItem('login-check'));
                if (loginCheck?.user?.nickname) return loginCheck.user.nickname;
                if (loginCheck?.user?.name) return loginCheck.user.name;
                if (loginCheck?.user?.username) return loginCheck.user.username;
            } catch (error) {
                console.error('login-check parse error:', error);
            }

            const commentUsername = localStorage.getItem('comment_username');
            if (commentUsername) return commentUsername;

            return '사용자';
        },

        getSelectedArtists() {
            try {
                return JSON.parse(localStorage.getItem('selectedArtists')) || [];
            } catch (error) {
                console.error('selectedArtists parse error:', error);
                return [];
            }
        },

        upgradeArtwork(url = '', size = 600) {
            if (!url) return '';
            return url.replace(/\/\d+x\d+bb\.jpg$/, `/${size}x${size}bb.jpg`);
        },

        formatDuration(ms) {
            if (!ms) return '0:00';

            const totalSeconds = Math.floor(ms / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            return `${minutes}:${String(seconds).padStart(2, '0')}`;
        },

        async searchTrack(term, country = 'KR') {
            try {
                const { data } = await searchApi({
                    term,
                    country,
                    media: 'music',
                    entity: 'song',
                    limit: 1
                });

                return data?.results?.[0] || null;
            } catch (error) {
                console.error('searchTrack error:', term, error);
                return null;
            }
        },

        async buildPlaylistTracks(trackKeywords = []) {
            const tracks = await Promise.all(
                trackKeywords.map(async (keyword, index) => {
                    const hit = await this.searchTrack(keyword, 'KR');

                    return {
                        id: `${keyword}-${index}`,
                        title: hit?.trackName || keyword,
                        artistName: hit?.artistName || '',
                        artworkUrl100: this.upgradeArtwork(hit?.artworkUrl100 || '', 600) || this.fallbackImage,
                        durationMs: hit?.trackTimeMillis || 0,
                        durationText: this.formatDuration(hit?.trackTimeMillis),
                        previewUrl: hit?.previewUrl || ''
                    };
                })
            );

            return tracks;
        },

        async buildSelectedArtistItems() {
            const selectedArtists = this.getSelectedArtists();

            if (!selectedArtists.length) return [];

            const representativeMap = {
                백예린: '백예린 Square',
                악뮤: 'AKMU Love Lee',
                헤이즈: '헤이즈 비도 오고 그래서'
            };

            const artistItems = await Promise.all(
                selectedArtists.map(async (artistName, index) => {
                    const keyword = representativeMap[artistName] || artistName;
                    const hit = await this.searchTrack(keyword, 'KR');

                    return {
                        id: `artist-${index}`,
                        type: 'artist',
                        name: artistName,
                        image: this.upgradeArtwork(hit?.artworkUrl100 || '', 300) || this.fallbackArtistImage,
                        representativeTrack: hit?.trackName || '',
                        representativeArtist: hit?.artistName || artistName
                    };
                })
            );

            return artistItems;
        },

        async buildApiLibrary() {
            const currentUsername = this.getCurrentUsername();

            const [playlist1Tracks, playlist2Tracks, artistItems] = await Promise.all([
                this.buildPlaylistTracks([
                    '윤하 사건의 지평선',
                    '아이유 Love wins all',
                    'NewJeans Ditto',
                    'aespa Supernova',
                    'DAY6 예뻤어',
                    'AKMU Love Lee',
                    '태연 To. X',
                    'LE SSERAFIM Smart'
                ]),
                this.buildPlaylistTracks([
                    '헤이즈 비도 오고 그래서',
                    '백예린 Square',
                    'IVE 해야',
                    'QWER 고민중독',
                    '악뮤 어떻게 이별까지 사랑하겠어 널 사랑하는 거지',
                    '아이유 Blueming',
                    '태연 Weekend',
                    'NewJeans Hype Boy'
                ]),
                this.buildSelectedArtistItems()
            ]);

            return [
                {
                    id: 1,
                    type: 'playlist',
                    title: '노래플리스트',
                    owner: currentUsername,
                    coverImage: playlist1Tracks[0]?.artworkUrl100 || this.fallbackImage,
                    tracks: playlist1Tracks
                },
                {
                    id: 2,
                    type: 'playlist',
                    title: '버스 도착 5분전',
                    owner: currentUsername,
                    coverImage: '',
                    tracks: playlist2Tracks
                },
                ...artistItems
            ];
        },

        async initLibrary() {
            try {
                const apiLibrary = await this.buildApiLibrary();
                saveLibraryItems(apiLibrary);
                this.libraryItems = apiLibrary;
            } catch (error) {
                console.error('initLibrary error:', error);
                this.libraryItems = getLibraryItems();
            }
        },

        addPlaylist() {
            const title = window.prompt('플레이리스트 이름을 입력해주세요.');

            if (!title || !title.trim()) return;

            const newPlaylist = {
                id: Date.now(),
                type: 'playlist',
                title: title.trim(),
                owner: this.getCurrentUsername(),
                coverImage: '',
                tracks: []
            };

            const updatedItems = [...this.libraryItems, newPlaylist];
            this.libraryItems = updatedItems;
            saveLibraryItems(updatedItems);
        }
    },
    mounted() {
        this.initLibrary();
    }
};
</script>

<style scoped>
.library-page {
    padding-top: 12px;
    padding-bottom: 24px;
}

.library-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.recent-box {
    width: 168px;
    height: 32px;
    border: 1px solid #cdd6ee;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    background: #fff;
}

.recent-box p {
    margin: 0;
    font-size: 13px;
    color: #1c274c;
}

.recent-box img {
    width: 18px;
    height: 18px;
}

.grid-btn {
    width: 32px;
    height: 32px;
    border: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
}

.grid-btn img {
    width: 18px;
    height: 18px;
}

.library-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.add-playlist-btn {
    width: 100%;
    height: 48px;
    margin-top: 8px;
    border: 1px dashed #b9c4e3;
    border-radius: 10px;
    background: #fff;
    color: #4d6bb3;
    font-size: 14px;
    font-weight: 600;
}
</style>
