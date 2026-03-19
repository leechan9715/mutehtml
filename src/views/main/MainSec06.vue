<template>
    <div class="artist-section">
        <div class="title-explain fw-600 color-black">
            <p>오늘의 아티스트 추천</p>
        </div>

        <Swiper class="artist-swiper" :slides-per-view="1.35" :space-between="14">
            <SwiperSlide v-for="(artist, index) in cards" :key="artist.id">
                <div :class="['card-wrapper', { clickable: index === 0 }]" @click="handleClick(index)">
                    <div class="artist-card">
                        <div class="card-top">
                            <img :src="artist.mainImage" :alt="`${artist.name} 대표 이미지`" />
                        </div>

                        <div class="card-bottom">
                            <h2 class="artist-name">{{ artist.name }}</h2>
                            <p class="artist-meta">{{ artist.meta }}</p>
                            <p class="artist-feature">{{ artist.feature }}</p>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import img01 from '@/assets/images/main/sec06/img01.png';
import img03 from '@/assets/images/main/sec06/img03.png';
import img05 from '@/assets/images/main/sec06/img05.png';
import img07 from '@/assets/images/main/sec06/img07.png';

export default {
    name: 'ArtistCardSlider',
    components: {
        Swiper,
        SwiperSlide
    },
    methods: {
        handleClick(index) {
            if (index === 0) {
                this.$router.push('/main/artist-info');
            }
        }
    },
    data() {
        return {
            cards: [
                {
                    id: 1,
                    name: 'Rosé',
                    meta: '29 | 여성 | 한국인',
                    feature: '독특한 음색과 감성적인 보컬이 특징이며 팝·록 기반의 서정적인 음악 스타일을 가진 아티스트',
                    mainImage: img01
                },
                {
                    id: 2,
                    name: 'Olivia Rodrigo',
                    meta: '23 | 여성 | 미국',
                    feature: '감정선을 강하게 살린 팝·팝록 스타일로 공감을 얻는 아티스트',
                    mainImage: img03
                },
                {
                    id: 3,
                    name: '아이유',
                    meta: '34 | 여성 | 대한민국',
                    feature: '서정적인 멜로디와 감성적인 보컬이 강점인 대표적인 아티스트',
                    mainImage: img05
                },
                {
                    id: 4,
                    name: '윤하',
                    meta: '36 | 여성 | 대한민국',
                    feature: '록 기반 사운드와 시원한 고음이 인상적인 여성 보컬 아티스트',
                    mainImage: img07
                }
            ]
        };
    }
};
</script>

<style scoped src="../../assets/styles/pages/main-css/sec-06.css"></style>
