<template>
    <div style="padding: 16px">
        <MainContainer title="최근 들은 곡" @click="goNext">
            <Swiper class="song-swiper" :slides-per-view="3.2" :space-between="16">
                <SwiperSlide v-for="(song, i) in this.songs" :key="i">
                    <SongCard
                        :title="song.trackName"
                        :artist="song.artistName"
                        :coverImage="song.albumCover"
                        :click="() => playSong(song, i)"
                    />
                </SwiperSlide>
            </Swiper>
        </MainContainer>
    </div>
</template>

<script>
import MainContainer from '@/components/ui/main-section-top.vue';
import SongCard from '@/components/ui/main-album-component.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { searchApi } from '@/api/_music_api';

const PLAYER_STATE_KEY = 'mute-player-state';

export default {
    name: 'TestView',
    components: { MainContainer, SongCard, Swiper, SwiperSlide },
    data() {
        return {
            selectedArtists: [],
            songs: []
        };
    },
    methods: {
        goNext() {
            console.log('헤더 클릭!');
        },
        async getArtistToSearch() {
            const storedArtists = localStorage.getItem('selectedArtists');
            this.selectedArtists = storedArtists ? JSON.parse(storedArtists) : [];
            // 아티스트 목록을 searchApi를 활용하여 데이터 가져오기
            const response = await Promise.all(
                this.selectedArtists.map((artist) =>
                    searchApi({ term: artist, country: 'KR', media: 'music', entity: 'song', limit: 2 })
                )
            );
            this.songs = response
                .flatMap((res) => res?.data?.results || [])
                .map((item) => ({
                    trackName: item.trackName || '',
                    artistName: item.artistName || '',
                    albumCover: item.artworkUrl100 || '',
                    previewUrl: item.previewUrl || ''
                }));
            // 로컬 스토리지에서 가져온 아티스트 목록을 searchApi를 활용하여 데이터 가져오기
        },
        async playSong(song, index) {
            if (!song?.trackName) return;

            try {
                const { data } = await searchApi({
                    term: song.artistName,
                    country: 'KR',
                    media: 'music',
                    entity: 'song',
                    limit: 100
                });

                const tracks = (data?.results || [])
                    .map((item) => ({
                        previewUrl: item?.previewUrl || '',
                        artistName: item?.artistName || '',
                        trackName: item?.trackName || '',
                        albumCover: item?.artworkUrl100 || ''
                    }))
                    .filter((item) => item.trackName);

                if (!tracks.length) return;

                let currentIndex = tracks.findIndex(
                    (item) => item.trackName === song.trackName && item.artistName === song.artistName
                );
                if (currentIndex < 0) currentIndex = Number.isInteger(index) ? index : 0;
                if (!tracks[currentIndex]) currentIndex = 0;

                if (!tracks[currentIndex]?.previewUrl) {
                    const playableIndex = tracks.findIndex((item) => !!item.previewUrl);
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
            } catch (error) {
                console.error('playSong error:', error);
            }
        }
    },
    mounted() {
        this.getArtistToSearch();
    }
};
</script>

<style scoped>
/* 기존 card-row의 padding 느낌 유지 */
.song-swiper {
    padding: 0 40px 0 0;
}
</style>
