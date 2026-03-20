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

            <button type="button" class="add-playlist-btn" @click="addPlaylist">+ 라이브러리 추가하기</button>
        </div>
    </section>
</template>

<script>
import LibraryItem from '@/components/layout/LibraryItem.vue';
import { saveLibraryItems, getLibraryItems } from '@/utils/libraryStorage';
import { searchApi } from '@/api/_music_api';
import { useMusicImageStore } from '@/store/music';

import playlist1 from '@/assets/images/main/playlist_cover/playlist_1.png';
import playlist2 from '@/assets/images/main/playlist_cover/playlist_2.png';
import playlist3 from '@/assets/images/main/playlist_cover/playlist_3.png';
import playlist4 from '@/assets/images/main/playlist_cover/playlist_4.png';
import playlist5 from '@/assets/images/main/playlist_cover/playlist_5.png';

export default {
    name: 'Library',
    components: {
        LibraryItem
    },
    data() {
        return {
            libraryItems: [],
            fallbackImage: require('@/assets/images/player/player-img1.png'),
            fallbackArtistImage: require('@/assets/images/artist-select/1.png'),
            musicImageStore: useMusicImageStore()
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

            const [playlist1Tracks, playlist2Tracks, playlist3Tracks, playlist4Tracks, playlist5Tracks, artistItems] =
                await Promise.all([
                    this.buildPlaylistTracks([
                        '윤하 사건의 지평선',
                        '아이유 Love wins all',
                        'NewJeans Ditto',
                        'aespa Supernova'
                    ]),
                    this.buildPlaylistTracks([
                        '헤이즈 비도 오고 그래서',
                        '백예린 Square',
                        '아이유 Blueming',
                        '태연 Weekend'
                    ]),
                    this.buildPlaylistTracks(['AKMU Love Lee', 'QWER 고민중독', 'DAY6 예뻤어', 'NewJeans Hype Boy']),
                    this.buildPlaylistTracks(['IVE 해야', 'LE SSERAFIM Smart', '태연 To. X', 'aespa Supernova']),
                    this.buildPlaylistTracks([
                        '아이유 밤편지',
                        '백예린 Antifreeze',
                        '검정치마 EVERYTHING',
                        '잔나비 주저하는 연인들을 위해'
                    ]),
                    this.buildSelectedArtistItems()
                ]);

            return [
                {
                    id: 1,
                    type: 'playlist',
                    title: 'Study mode',
                    owner: currentUsername,
                    coverImage: playlist1,
                    tracks: playlist1Tracks
                },
                {
                    id: 2,
                    type: 'playlist',
                    title: '지금 여행중',
                    owner: currentUsername,
                    coverImage: playlist2,
                    tracks: playlist2Tracks
                },
                {
                    id: 3,
                    type: 'playlist',
                    title: '공상에 빠져',
                    owner: currentUsername,
                    coverImage: playlist3,
                    tracks: playlist3Tracks
                },
                {
                    id: 4,
                    type: 'playlist',
                    title: '일요일 오후 2시 느낌',
                    owner: currentUsername,
                    coverImage: playlist4,
                    tracks: playlist4Tracks
                },
                {
                    id: 5,
                    type: 'playlist',
                    title: 'WORKING',
                    owner: currentUsername,
                    coverImage: playlist5,
                    tracks: playlist5Tracks
                },
                ...artistItems
            ];
        },

        async initLibrary() {
            try {
                const storedItems = getLibraryItems();
                if (Array.isArray(storedItems) && storedItems.length) {
                    this.libraryItems = storedItems;
                    return;
                }

                const apiLibrary = await this.buildApiLibrary();
                saveLibraryItems(apiLibrary);
                this.libraryItems = apiLibrary;
            } catch (error) {
                console.error('initLibrary error:', error);
                this.libraryItems = getLibraryItems();
            }
        },

        onLibraryItemsUpdated(event) {
            if (event?.detail && Array.isArray(event.detail)) {
                this.libraryItems = event.detail;
                return;
            }
            this.libraryItems = getLibraryItems();
        },

        addPlaylist() {
            const title = window.prompt('라이브러리 이름을 입력해주세요.');

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
        window.addEventListener('library-items-updated', this.onLibraryItemsUpdated);
    },
    beforeUnmount() {
        window.removeEventListener('library-items-updated', this.onLibraryItemsUpdated);
    }
};
</script>
<style scoped src="@/assets/styles/pages/library.css"></style>
