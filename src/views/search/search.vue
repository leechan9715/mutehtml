<template>
    <div id="container-wrap">
        <section class="container" id="section1">
            <div class="row">
                <div class="col-1">
                    <h2 class="font-20 fw-medium">검색하기</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-1">
                    <input type="text" placeholder="가수 · 노래제목 · 가사를 적어주세요" />
                    <span class="material-symbols-outlined bold"> search </span>
                </div>
            </div>
            <div class="row">
                <Swiper class="lsc-swiper-1" :slides-per-view="3.8" :space-between="15">
                    <SwiperSlide v-for="(genre, i) in genres" :key="i">
                        <h3>{{ genre }}</h3>
                    </SwiperSlide>
                </Swiper>
            </div>
        </section>
        <section class="container" id="section2">
            <div class="row">
                <div class="col-1">
                    <h2>소장하고 싶은 앨범 아트워크 큐레이션</h2>
                </div>
            </div>
            <div class="row">
                <Swiper
                    class="albumSwiper"
                    :slides-per-view="3"
                    effect="coverflow"
                    :grab-cursor="true"
                    :centered-slides="true"
                    :coverflow-effect="{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 3,
                        slideShadows: true
                    }"
                    :loop="true"
                    :pagination="{ clickable: true }"
                    :modules="albumModules"
                    @slideChange="onSlideChange"
                    @swiper="onSwiper"
                >
                    <SwiperSlide v-for="(album, i) in albums" :key="i">
                        <img :src="album.img" :alt="album.title" />
                    </SwiperSlide>
                    <template #container-end>
                        <div class="swiper-pagination"></div>
                    </template>
                </Swiper>
            </div>
            <div class="row">
                <div class="col-1">
                    <p>{{ currentTitle }}</p>
                    <p>{{ currentArtist }}</p>
                </div>
            </div>
        </section>
        <section class="container" id="section3">
            <div class="row">
                <div class="col-1">
                    <h2 class="font-20 fw-medium">장르 탐색</h2>
                </div>
            </div>
            <div class="row g-20">
                <SearchCategory
                    v-for="(genre, i) in genreList"
                    :key="i"
                    :category="genre.label"
                    :bgImg="genre.bgImg"
                    class="col-2"
                />
            </div>
        </section>
    </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import SearchCategory from '@/components/ui/search-category-button.vue';

// ✅ 이미지 한 번에 로드 (albumImg 개별 import 제거)
const imageFiles = require.context('@/assets/images/search', false, /\.png$/);

function getImg(name) {
    return imageFiles(`./${name}.png`);
}

export default {
    components: { Swiper, SwiperSlide, SearchCategory },

    data() {
        return {
            albumModules: [Pagination, EffectCoverflow],

            genres: [
                '클래식',
                '하드메탈',
                '보사노바',
                '팝',
                '락',
                '클래식',
                '하드메탈',
                '보사노바',
                '팝',
                '락',
                '클래식',
                '하드메탈',
                '보사노바',
                '팝',
                '락'
            ],

            genreList: [
                { label: 'Pop', bgImg: getImg('pop') },
                { label: 'Kpop', bgImg: getImg('kpop') },
                { label: 'Hip-Hop', bgImg: getImg('hiphop') },
                { label: 'R&B/Soul', bgImg: getImg('soul') },
                { label: 'Lo-fi', bgImg: getImg('lo-fi') },
                { label: 'City Pop', bgImg: getImg('citypop') },
                { label: 'Indie', bgImg: getImg('indie') },
                { label: 'Jazz', bgImg: getImg('jazz') },
                { label: 'Classic', bgImg: getImg('classic') },
                { label: 'Bossanova', bgImg: getImg('bossanova') },
                { label: 'EDM', bgImg: getImg('edm') },
                { label: 'Rock', bgImg: getImg('rock') }
            ],

            // ✅ 각 앨범마다 다른 이미지 + 정보
            albums: [
                { title: 'Feel My Rhythm', artist: 'Red Velvet', img: getImg('img-1') },
                { title: 'Ditto', artist: 'NewJeans', img: getImg('img-2') },
                { title: 'Antifragile', artist: 'LE SSERAFIM', img: getImg('img-3') },
                { title: 'Hype Boy', artist: 'NewJeans', img: getImg('img-4') },
                { title: 'INVU', artist: 'TAEYEON', img: getImg('img-5') },
                // ✅ 부족한 1장 채우기 (첫 번째 반복)
                { title: 'Feel My Rhythm', artist: 'Red Velvet', img: getImg('img-1') }
            ],

            // ✅ 초기값은 첫 번째 앨범
            currentTitle: 'Feel My Rhythm',
            currentArtist: 'Red Velvet',
            swiperInstance: null
        };
    },

    methods: {
        onSwiper(swiper) {
            this.swiperInstance = swiper;
        },
        onSlideChange() {
            const swiper = this.swiperInstance;
            if (!swiper) return;

            // ✅ loop 모드에서는 realIndex 사용
            const current = this.albums[swiper.realIndex];
            if (current) {
                this.currentTitle = current.title;
                this.currentArtist = current.artist;
            }
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/search-css/search.css"></style>
