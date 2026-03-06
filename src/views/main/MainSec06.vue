<template>
    <div
        style="
            padding: 16px;
            background:
                linear-gradient(270deg, rgba(255, 255, 255, 0.52) 0%, rgba(187, 209, 255, 0.52) 100%),
                linear-gradient(0deg, rgba(248, 220, 255, 1) 0%, rgba(211, 244, 254, 1) 100%);
        "
    >
        <MainContainer title="내 취향저격 가수" @click="goNext">
            <Swiper class="favorite-artist" :slides-per-view="3.2" :space-between="16">
                <SwiperSlide v-for="(artist, index) in artists" :key="index">
                    <ArtistSelectBtn
                        :artistImg="artist.img"
                        :artistName="artist.name"
                        :value="index + 1"
                        :artistId="String(index + 1)"
                        v-model="selectedArtists"
                    />
                </SwiperSlide>
            </Swiper>
        </MainContainer>
    </div>
</template>

<script>
import MainContainer from '@/components/ui/main-section-top.vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import ArtistSelectBtn from '@/components/ui/ArtistSelectBtn.vue';
import imgs from '@/assets/images/artist-select/1.png';

export default {
    name: 'favorite-artist',
    components: { MainContainer, Swiper, SwiperSlide, ArtistSelectBtn },
    data() {
        return {
            artists: Array.from({ length: 8 }, () => ({
                name: '아이유',
                img: imgs
            })),
            // ✅ 오타 수정: slelectAtrists -> selectedArtists
            selectedArtists: []
        };
    },
    methods: {
        goNext() {
            console.log('헤더 클릭!');
        }
    }
};
</script>

<style scoped src="../../assets/styles/pages/main-css/sec-06.css"></style>
