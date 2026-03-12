<template>
    <div class="artist-section">
        <div class="title-explain fw-600 color-black">
            <p>오늘의 아티스트 추천</p>
        </div>

        <Swiper class="artist-swiper" :slides-per-view="1.35" :space-between="14">
            <SwiperSlide v-for="artist in cards" :key="artist.id">
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
    data() {
        return {
            cards: [
                {
                    id: 1,
                    name: 'Sabrina Carpenter',
                    meta: '26 | 여성 | 미국',
                    feature: '밝고 경쾌한 팝 사운드와 위트 있는 가사가 특징인 트렌디한 아티스트.',
                    mainImage: img01
                },
                {
                    id: 2,
                    name: 'Olivia Rodrigo',
                    meta: '23 | 여성 | 미국',
                    feature: '감정선을 강하게 살린 팝·팝록 스타일로 공감을 얻는 싱어송라이터.',
                    mainImage: img03
                },
                {
                    id: 3,
                    name: '아이유',
                    meta: '34 | 여성 | 대한민국',
                    feature: '서정적인 멜로디와 감성적인 보컬이 강점인 대표적인 아티스트.',
                    mainImage: img05
                },
                {
                    id: 4,
                    name: '윤하',
                    meta: '36 | 여성 | 대한민국',
                    feature: '록 기반 사운드와 시원한 고음이 인상적인 여성 보컬 아티스트.',
                    mainImage: img07
                }
            ]
        };
    }
};
</script>

<style scoped>
.artist-section {
    margin: 0 16px;
    padding: 20px 0 32px;
}

.title-explain {
    margin-bottom: 14px;
    font-size: clamp(16px, 4.5vw, 22px);
}

.artist-swiper {
    padding-right: 32px;
}

.artist-card {
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid var(--color-accent-blue);
    box-shadow: 0 4px 6px var(--color-shadow);
    background: #fff;
}

.card-top {
    aspect-ratio: 16 / 10;
    overflow: hidden;
}

.card-top img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.card-bottom {
    padding: 14px;
}

.artist-name {
    margin: 0 0 8px;
    font-size: clamp(16px, 4vw, 18px);
    font-weight: 700;
    color: var(--color-black);
}

.artist-meta {
    margin: 0 0 8px;
    font-size: clamp(12px, 3.2vw, 14px);
    color: var(--color-gray);
}

.artist-feature {
    margin: 0;
    font-size: clamp(12px, 3.2vw, 14px);
    line-height: 1.45;
    color: var(--color-black);

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@media (min-width: 768px) {
    .artist-swiper {
        padding-right: 40px;
    }
}
</style>
