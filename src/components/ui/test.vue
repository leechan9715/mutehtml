<template>
    <div style="padding: 16px">
        <MainContainer title="최근 들은 곡" @click="goNext">
            <Swiper class="song-swiper" :slides-per-view="3.2" :space-between="16">
                <SwiperSlide v-for="(song, i) in songs" :key="i">
                    <SongCard :title="song.title" :artist="song.artist" :coverImage="song.cover" />
                </SwiperSlide>
            </Swiper>
        </MainContainer>
    </div>
</template>

<script>
import img01 from '@/assets/images/main/sec01/img01.png';
import img02 from '@/assets/images/main/sec01/img02.png';
import img03 from '@/assets/images/main/sec01/img03.png';
import img04 from '@/assets/images/main/sec01/img04.png';
import img05 from '@/assets/images/main/sec01/img05.png';

import MainContainer from '@/components/ui/main-section-top.vue';
import SongCard from '@/components/ui/main-album-component.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

export default {
    name: 'TestView',
    components: { MainContainer, SongCard, Swiper, SwiperSlide },
    data() {
        return {
            songs: [
                { title: 'RUDE', artist: 'Hearts2Hearts(하츠투하츠)', cover: img01 },
                { title: '주저하는 연인들을 위해', artist: '잔나비', cover: img02 },
                { title: 'Go For Love', artist: '민수', cover: img03 },
                { title: '우리는 사랑이 돼요', artist: '안녕하신가영', cover: img04 },
                { title: 'Forever', artist: 'Santi , ANNIAMO , Aexcit', cover: img05 }
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
