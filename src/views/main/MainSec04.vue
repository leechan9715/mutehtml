<template>
    <div style="padding: 16px">
        <MainContainer title="오늘의 장르 추천 : 힙합" @click="goNext" :showArrow="false">
            <Swiper
                class="genre-swiper"
                effect="coverflow"
                :grab-cursor="true"
                :centered-slides="true"
                :centered-slides-bounds="true"
                :slides-per-view="'auto'"
                :initial-slide="3"
                :observer="true"
                :observe-parents="true"
                :update-on-window-resize="true"
                :watch-overflow="true"
                :coverflow-effect="{
                    rotate: 0,
                    stretch: 50,
                    depth: 50,
                    modifier: 1,
                    slideShadows: false,
                    scale: 0.96
                }"
                :modules="modules"
                @slideChange="onSlideChange"
            >
                <SwiperSlide
                    v-for="(album, i) in albums"
                    :key="i"
                    class="genre-slide"
                    :class="{ 'active-slide': i === activeIndex }"
                    @click="album.info && i === activeIndex && toggleOverlay(i)"
                >
                    <img :src="album.cover" :alt="album.alt" />

                    <div v-if="album.info" class="album-overlay" :class="{ show: selectedIndex === i }">
                        <div class="album-info">
                            <h3 class="album-title">{{ album.title }}</h3>
                            <p class="album-artist">{{ album.artist }}</p>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </MainContainer>
        <div class="hiphop-info">
            <p>What is 힙합</p>
            <p>
                1970년대 <span class="color-black">미국 뉴욕 브롱크스 </span>지역에서 시작된 음악 문화로, 강한 비트 위에
                랩을 얹어 자신의 이야기와 감정을 표현하는 것이 특징이며
                <span class="color-black">자유로운 분위기와 개성</span>을 중요하게 여기는 장르다.
            </p>
        </div>
    </div>
</template>

<script>
import MainContainer from '@/components/ui/main-section-top.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

import cover1 from '@/assets/images/main/albumSlide/cover1.png';
import cover2 from '@/assets/images/main/albumSlide/cover2.png';
import cover3 from '@/assets/images/main/albumSlide/cover3.png';
import cover4 from '@/assets/images/main/albumSlide/cover4.png';
import cover5 from '@/assets/images/main/albumSlide/cover5.png';
import cover6 from '@/assets/images/main/albumSlide/cover6.png';
import cover7 from '@/assets/images/main/albumSlide/cover7.png';
import cover8 from '@/assets/images/main/albumSlide/cover8.png';
import cover9 from '@/assets/images/main/albumSlide/cover9.png';

export default {
    name: 'ForU',
    components: {
        MainContainer,
        Swiper,
        SwiperSlide
    },
    data() {
        return {
            modules: [EffectCoverflow],
            activeIndex: 3,
            selectedIndex: null,
            albums: [
                {
                    cover: cover1,
                    alt: 'album_cover1',
                    info: false
                },
                {
                    cover: cover2,
                    alt: 'album_cover2',
                    info: true,
                    title: 'Money Trees',
                    artist: 'Kendrick Lamar'
                },
                {
                    cover: cover3,
                    alt: 'album_cover3',
                    info: true,
                    title: 'Big Dawgs',
                    artist: 'Hanumankind'
                },
                {
                    cover: cover4,
                    alt: 'album_cover4',
                    info: true,
                    title: 'TR!BE ON THE MOVE',
                    artist: 'TR!BE'
                },
                {
                    cover: cover5,
                    alt: 'album_cover5',
                    info: true,
                    title: 'Still D.R.E.',
                    artist: 'Dr. Dre'
                },
                {
                    cover: cover6,
                    alt: 'album_cover6',
                    info: true,
                    title: 'HUMBLE.',
                    artist: 'Kendrick Lamar'
                },
                {
                    cover: cover7,
                    alt: 'album_cover7',
                    info: true,
                    title: 'Most Wanted',
                    artist: 'Towa'
                },
                {
                    cover: cover8,
                    alt: 'album_cover8',
                    info: true,
                    title: 'LAW (Prod.Czaer)',
                    artist: '윤미래, 비비'
                },
                {
                    cover: cover9,
                    alt: 'album_cover9',
                    info: false
                }
            ]
        };
    },
    methods: {
        goNext() {
            console.log('헤더 클릭!');
        },
        onSlideChange(swiper) {
            this.activeIndex = swiper.activeIndex;
            this.selectedIndex = null;
        },
        toggleOverlay(index) {
            this.selectedIndex = this.selectedIndex === index ? null : index;
        }
    }
};
</script>

<style scoped src="../../assets/styles/pages/main-css/sec-04.css"></style>
