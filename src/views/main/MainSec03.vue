<template>
    <div style="padding: 16px">
        <MainContainer title="자주 듣는 플레이리스트" @click="goNext">
            <Swiper class="song-swiper" :slides-per-view="3.2" :space-between="16">
                <SwiperSlide v-for="(song, i) in songs" :key="i">
                    <SongCard :title="song.title" :artist="song.artist" :coverImage="song.cover" />
                </SwiperSlide>
            </Swiper>
        </MainContainer>
    </div>
</template>

<script>
import playlist1 from '@/assets/images/main/playlist_cover/playlist_1.png';
import playlist2 from '@/assets/images/main/playlist_cover/playlist_2.png';
import playlist3 from '@/assets/images/main/playlist_cover/playlist_3.png';
import playlist4 from '@/assets/images/main/playlist_cover/playlist_4.png';
import playlist5 from '@/assets/images/main/playlist_cover/playlist_5.png';
import MainContainer from '@/components/ui/main-section-top.vue';
import SongCard from '@/components/ui/main-album-component.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import testImg from '@/assets/images/main/test.png';

export default {
    name: 'TestView',
    components: { MainContainer, SongCard, Swiper, SwiperSlide },
    data() {
        return {
            songs: [
                { title: 'Study mode', artist: 'Playlist · 홍길동', cover: playlist1 },
                { title: '지금 여행중', artist: 'Playlist · 홍길동', cover: playlist2 },
                { title: '공상에 빠져', artist: 'Playlist · 홍길동', cover: playlist3 },
                { title: '일요일 오후 2시 느낌', artist: 'Playlist · 홍길동', cover: playlist4 },
                { title: 'WORKING', artist: 'Playlist · 홍길동', cover: playlist5 }
            ]
        };
    },
    methods: {
        goNext() {
            console.log('헤더 클릭!');
        }
    }
};
</script>

<style scoped>
/* 기존 card-row의 padding 느낌 유지 */
.song-swiper {
    padding: 0 40px 0 0;
}
</style>
