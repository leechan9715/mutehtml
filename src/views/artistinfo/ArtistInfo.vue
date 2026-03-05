<template>
    <h2 class="hidden">아티스트 소개</h2>
    <section class="container">
        <AppTopBar />
    </section>
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
    <section class="container">
        <div class="row album-info">
            <p class="album-text">앨범 · 싱글</p>
            <Swiper class="artist-info-swiper" :slides-per-view="2.4" :space-between="13">
                <SwiperSlide>
                    <img src="@/assets/images/artist-info/albums-img/album1.png" alt="album2" class="albums" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="@/assets/images/artist-info/albums-img/album2.png" alt="album2" class="albums" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="@/assets/images/artist-info/albums-img/album3.png" alt="album3" class="albums" />
                </SwiperSlide>
            </Swiper>
        </div>
    </section>
</template>

<script>
import AppTopBar from '@/components/layout/AppTopBar.vue';
import MainContainer from '@/components/ui/main-section-top.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

export default {
    name: 'ArtistInfo',
    components: {
        AppTopBar,
        MainContainer,
        Swiper,
        SwiperSlide
    }
    // data() {
    //     return {
    //         songs: Array.from({ length: 8 }).map(() => ({
    //             title: '혜성',
    //             artist: '윤하(YOUNAH)',
    //             cover: testImg
    //         }))
    //     };
    // },
    // methods: {
    //     goNext() {
    //         console.log('헤더 클릭!');
    //     }
    // }
};
</script>

<style scoped src="@/assets/styles/pages/artistinfo.css">
.song-swiper {
    padding: 0 40px 0 0;
}
</style>
