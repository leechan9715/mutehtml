<template>
    <div style="padding: 16px">
        <MainContainer title="오늘의 장르 추천 : 힙합" @click="goNext">
            <Swiper
                class="genre-swiper"
                effect="coverflow"
                :grab-cursor="true"
                :centered-slides="true"
                :slides-per-view="'auto'"
                :initial-slide="3"
                :coverflow-effect="{
                    rotate: 0,
                    stretch: 100,
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

<style scoped>
.genre-swiper {
    width: 100%;
    height: 170px;
    padding-left: 16px;
    padding-right: 80px;
}

.genre-slide {
    position: relative;
    width: 165px;
    cursor: pointer;
}

.genre-slide img {
    display: block;
    width: 160px;
    height: 160px;
    border-radius: 20px;
    object-fit: cover;
    transition: filter 0.3s ease;
    filter: brightness(0.55);
}

.genre-slide.active-slide img {
    filter: brightness(1);
}

.album-overlay {
    position: absolute;
    inset: 0;
    width: 165px;
    height: 165px;
    border-radius: 20px;
    border: 1px solid white;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    padding: 14px;
    opacity: 0;
    visibility: hidden;
    transition:
        opacity 0.25s ease,
        visibility 0.25s ease;
}

.album-overlay.show {
    opacity: 1;
    visibility: visible;
}

.album-info {
    width: 100%;
    color: var(--color-black);
}

.album-title {
    margin: 0 0 4px;
    font-size: 16px;
    line-height: 1.2;
    font-weight: 700;
}

.album-artist {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-gray);
}
</style>
