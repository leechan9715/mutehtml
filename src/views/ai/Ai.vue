<template>
    <section class="container ai-page" :class="{ 'ai-searched': isSearched }">
        <div class="row g-43 ai-hero ai-reveal ai-reveal-1">
            <div class="col-1 ai-hero-copy">
                <h1>뮤직 도우미</h1>
                <h2>오늘은 어떤 음악을 원하시나요?</h2>
            </div>
            <div class="col-1 ai-hero-visual">
                <div class="ai-logo-float">
                    <Logo />
                </div>
                <img class="ai-logo-shadow" src="@/assets/images/ai/shadow.png" alt="" />
            </div>
        </div>
        <form class="row g-24 ai-form" @submit.prevent="submitEmotion">
            <div class="row g-16 ai-suggest ai-reveal ai-reveal-2">
                <template v-if="showEmotionSuggestions">
                    <div class="col-1">
                        <p>이런 음악은 어떠세요 ?</p>
                    </div>
                    <div class="col-1" v-for="(item, index) in emotion" :key="index">
                        <button type="button" @click="selectEmotion(item)">{{ item }}</button>
                    </div>
                </template>
                <div class="col-1 ai-inline-loading" v-if="aiLoading">
                    <DotLottieVue class="ai-loading-lottie" autoplay loop :data="loadingDotsData" />
                </div>
                <div class="col-1 ai-result" v-if="songs.length">
                    <div class="ai-result-head">
                        <p>추천 결과</p>
                        <button type="button" class="ai-add-btn" @click="addAllToMyPlaylist">
                            플레이리스트에 담기
                        </button>
                        <button type="button" class="ai-add-btn" @click="addAllToLibrary">라이브러리에 담기</button>
                    </div>
                    <div class="row g-12 ai-result-list">
                        <MainListItem
                            v-for="(song, index) in visibleSongs"
                            :key="`${song.title}-${song.artist}-${index}`"
                            :title="song.trackName || song.title"
                            :singer="song.artistName || song.artist"
                            :img="song.albumCover || song.artworkUrl100"
                            :preview-url="song.previewUrl"
                            :played-at="song.playedAt"
                        />
                    </div>
                </div>
            </div>
            <div class="row ai-input">
                <div class="col-1 ai-reveal ai-reveal-3">
                    <input type="text" placeholder="원하는 장르를 검색하세요" v-model="emotionInput" />
                    <button type="submit" :disabled="aiLoading">전송</button>
                </div>
            </div>
        </form>
    </section>
</template>

<script>
import Logo from '@/components/ui/Logo.vue';
import MainListItem from '@/components/layout/MainListItem.vue';
import { searchMusicByEmotion } from '@/api/_ai';
import { searchApi } from '@/api/_music_api';
import { getLibraryItems, saveLibraryItems } from '@/utils/libraryStorage';
import { useMusicImageStore } from '@/store/music';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import loadingDots from '@/assets/lottie/Loading_Dots_Blue.json';

const MY_PLAYLIST_KEY = 'my-playlist';

export default {
    name: 'Ai',
    data() {
        return {
            emotion: [
                '드라이브할때 듣기 좋은 팝송 추천',
                '우울한 날 위로해주는 발라드 추천 해줘',
                '불멍할 때 듣기 좋은 노래 추천해 줘',
                '밤 산책 할 때 듣기 좋은 저음 보컬 인디팝 틀어줘',
                '밤 산책 할 때 듣기 좋은 몽환적인 인디팝 들려줘'
            ],
            emotionInput: '',
            songs: [],
            aiLoading: false,
            showEmotionSuggestions: true,
            loadingDotsData: JSON.stringify(loadingDots),
            musicImageStore: useMusicImageStore()
        };
    },
    components: {
        Logo,
        MainListItem,
        DotLottieVue
    },
    computed: {
        isSearched() {
            return !this.showEmotionSuggestions;
        },
        visibleSongs() {
            return this.songs.slice(0, 10);
        }
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

            return '사용자';
        },
        upgradeArtwork600(url = '') {
            return this.musicImageStore.upgradeArtwork(url, 600);
        },
        async enrichSongsWithArtwork(songs = []) {
            const enrichedSongs = await Promise.all(
                songs.map(async (song, index) => {
                    try {
                        const term = `${song?.artist || ''} ${song?.title || ''}`.trim();
                        if (!term) {
                            return {
                                ...song,
                                trackName: song?.title || '',
                                artistName: song?.artist || '',
                                previewUrl: '',
                                albumCover: '',
                                artworkUrl100: '',
                                playedAt: Date.now() + index
                            };
                        }

                        const { data } = await searchApi({
                            term,
                            country: 'KR',
                            media: 'music',
                            entity: 'song',
                            limit: 10
                        });

                        const candidates = data?.results || [];
                        const normalizedTitle = (song?.title || '').trim().toLowerCase();
                        const normalizedArtist = (song?.artist || '').trim().toLowerCase();
                        const hit =
                            candidates.find((item) => {
                                const t = (item?.trackName || '').trim().toLowerCase();
                                const a = (item?.artistName || '').trim().toLowerCase();
                                return t === normalizedTitle && a === normalizedArtist;
                            }) ||
                            candidates.find((item) => {
                                const a = (item?.artistName || '').trim().toLowerCase();
                                return normalizedArtist && a.includes(normalizedArtist);
                            }) ||
                            candidates[0];
                        return {
                            ...song,
                            trackName: hit?.trackName || song?.title || '',
                            artistName: hit?.artistName || song?.artist || '',
                            previewUrl: hit?.previewUrl || '',
                            albumCover: this.upgradeArtwork600(hit?.artworkUrl100 || ''),
                            artworkUrl100: this.upgradeArtwork600(hit?.artworkUrl100 || ''),
                            trackTimeMillis: hit?.trackTimeMillis || 0,
                            trackId: hit?.trackId || '',
                            playedAt: Date.now() + index
                        };
                    } catch (error) {
                        return {
                            ...song,
                            trackName: song?.title || '',
                            artistName: song?.artist || '',
                            previewUrl: '',
                            albumCover: '',
                            artworkUrl100: '',
                            playedAt: Date.now() + index
                        };
                    }
                })
            );

            return enrichedSongs;
        },
        selectEmotion(value) {
            this.emotionInput = value;
        },
        addAllToMyPlaylist() {
            if (!this.songs.length) return;

            const playlistItems = this.songs
                .map((song, index) => ({
                    albumCover: song?.albumCover || song?.artworkUrl100 || '',
                    artistName: song?.artistName || song?.artist || '',
                    playedAt: Number(song?.playedAt) || Date.now() + index,
                    previewUrl: song?.previewUrl || '',
                    trackName: song?.trackName || song?.title || ''
                }))
                .filter((item) => item.trackName && item.previewUrl);

            try {
                const raw = localStorage.getItem(MY_PLAYLIST_KEY);
                const playlist = raw ? JSON.parse(raw) : [];
                const safePlaylist = Array.isArray(playlist) ? playlist : [];

                const dedupedNewItems = playlistItems.filter((newItem) => {
                    return !safePlaylist.some((savedItem) => {
                        const samePreview =
                            savedItem?.previewUrl && newItem.previewUrl && savedItem.previewUrl === newItem.previewUrl;
                        const sameTitleArtist =
                            (savedItem?.trackName || '').trim().toLowerCase() ===
                                newItem.trackName.trim().toLowerCase() &&
                            (savedItem?.artistName || '').trim().toLowerCase() ===
                                newItem.artistName.trim().toLowerCase();
                        return samePreview || sameTitleArtist;
                    });
                });

                const nextPlaylist = [...safePlaylist, ...dedupedNewItems];
                localStorage.setItem(MY_PLAYLIST_KEY, JSON.stringify(nextPlaylist));
                window.dispatchEvent(new CustomEvent('my-playlist-updated', { detail: nextPlaylist }));
                alert(`${dedupedNewItems.length}곡이 플레이리스트에 추가되었습니다.`);
            } catch (error) {
                console.error('my-playlist 저장 실패:', error);
            }
        },
        addAllToLibrary() {
            if (!this.songs.length) return;

            const inputTitle = window.prompt(
                '라이브러리에 저장할 플레이리스트 이름을 입력해주세요.',
                (this.emotionInput || 'AI 추천 플레이리스트').trim() || 'AI 추천 플레이리스트'
            );
            const playlistTitle = (inputTitle || '').trim();
            if (!playlistTitle) return;

            const tracks = this.songs
                .map((song, index) => ({
                    id: String(song?.trackId || `${Date.now()}-${index}`),
                    title: song?.trackName || song?.title || '',
                    artistName: song?.artistName || song?.artist || '',
                    artworkUrl100: song?.albumCover || song?.artworkUrl100 || '',
                    durationMs: Number(song?.trackTimeMillis) || 0,
                    previewUrl: song?.previewUrl || ''
                }))
                .filter((track) => track.title && track.previewUrl);

            if (!tracks.length) return;

            const newLibraryPlaylist = {
                id: Date.now(),
                type: 'playlist',
                title: playlistTitle,
                owner: this.getCurrentUsername(),
                coverImage: tracks[0]?.artworkUrl100 || '',
                tracks
            };

            try {
                const currentItems = getLibraryItems();
                const safeItems = Array.isArray(currentItems) ? currentItems : [];
                const nextItems = [...safeItems, newLibraryPlaylist];
                saveLibraryItems(nextItems);
                alert(`라이브러리에 플레이리스트가 추가되었습니다. (${tracks.length}곡)`);
            } catch (error) {
                console.error('mute-library-items-v1 저장 실패:', error);
            }
        },
        async submitEmotion() {
            const trimmedEmotion = this.emotionInput.trim();
            if (!trimmedEmotion) {
                return;
            }
            this.showEmotionSuggestions = false;
            this.songs = [];
            this.aiLoading = true;
            try {
                console.log('[AI] request payload:', { emotion: trimmedEmotion });
                const res = await searchMusicByEmotion(trimmedEmotion);
                console.log('[AI] response:', res.data);
                const rawSongs = Array.isArray(res.data?.songs) ? res.data.songs : [];
                this.songs = await this.enrichSongsWithArtwork(rawSongs);
            } catch (error) {
                const serverData = error.response?.data;
                const serverMessage =
                    serverData?.message || serverData?.error || serverData?.msg || '서버 내부 오류가 발생했습니다.';
                this.songs = [];

                console.error('[AI] request failed:', {
                    message: error.message,
                    status: error.response?.status,
                    data: serverData,
                    serverMessage
                });
                console.error('[AI] raw error object:', error);
            } finally {
                this.aiLoading = false;
            }
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/ai.css"></style>
<style scoped>
.ai-logo-float {
    display: inline-block;
    animation: ai-logo-float 3.8s ease-in-out infinite;
    will-change: transform;
}

.ai-logo-shadow {
    transform-origin: center center;
    animation: ai-logo-shadow-breathe 3.8s ease-in-out infinite;
    will-change: transform;
}

@keyframes ai-logo-float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8px);
    }
}

@keyframes ai-logo-shadow-breathe {
    0%,
    100% {
        transform: scale(0.85);
    }
    50% {
        transform: scale(1.2);
    }
}

@media (prefers-reduced-motion: reduce) {
    .ai-logo-float,
    .ai-logo-shadow {
        animation: none;
    }

    .ai-reveal {
        animation: none;
        opacity: 1;
        transform: none;
    }
}

.ai-reveal {
    opacity: 0;
    transform: translateY(-20px);
    animation: ai-reveal-up 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    will-change: opacity, transform;
}

.ai-reveal-1 {
    animation-delay: 0.04s;
}

.ai-reveal-2 {
    animation-delay: 0.16s;
}

.ai-reveal-3 {
    animation-delay: 0.28s;
}

@keyframes ai-reveal-up {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
