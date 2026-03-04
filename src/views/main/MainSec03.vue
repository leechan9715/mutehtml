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
            songs: Array.from({ length: 8 }).map(() => ({
                title: '혜성',
                artist: '윤하(YOUNAH)',
                cover: testImg
            }))
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
