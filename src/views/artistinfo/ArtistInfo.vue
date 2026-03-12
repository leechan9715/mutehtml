<template>
    <h2 class="hidden">아티스트 소개</h2>

    <section class="container">
        <div class="row">
            <div class="col-1 artist-info">
                <div class="artist_img">
                    <img src="../../assets/images/artist-info/artist-img/artist_rose.png" alt="artist_rose" />
                </div>
                <p class="artist-name">Rosé</p>
                <p class="artist-type">솔로가수 · 아티스트</p>
            </div>
        </div>
    </section>

    <div style="padding: 16px">
        <MainContainer title="싱글 · 앨범" @click="goNext">
            <Swiper class="song-swiper" :slides-per-view="3.2" :space-between="16">
                <SwiperSlide v-for="(song, i) in songs" :key="i">
                    <SongCard :title="song.title" :artist="song.artist" :coverImage="song.cover" />
                </SwiperSlide>
            </Swiper>
        </MainContainer>
    </div>
</template>

<script>
import album1 from '@/assets/images/artist-info/album1.png';
import album2 from '@/assets/images/artist-info/album2.png';
import album3 from '@/assets/images/artist-info/album3.png';
import album4 from '@/assets/images/artist-info/album4.png';
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
                { title: 'On The Ground', artist: 'Single · Rosé', cover: album1 },
                { title: 'Gone', artist: 'Single · Rosé', cover: album1 },
                { title: 'APT', artist: 'Single · Rosé', cover: album2 },
                { title: 'R', artist: 'Album · Rosé', cover: album3 },
                { title: 'Rosie', artist: 'Album · Rosé', cover: album4 }
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
