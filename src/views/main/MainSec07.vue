<template>
    <div style="padding: 16px; margin-bottom: 120px">
        <MainContainer title="아티스트 모먼트" @click="goNext">
            <Swiper class="song-swiper" :slides-per-view="3.2" :space-between="16">
                <SwiperSlide v-for="(short, i) in shorts" :key="i" class="shorts">
                    <div class="information">
                        <img :src="short.cover" :alt="short.title" />
                        <div class="artist">
                            <p class="artist_song">{{ short.title }}</p>
                            <p class="artist_name">{{ short.artist }}</p>
                        </div>
                        <div class="buttons">
                            <img src="../../assets/images/icon/play.png" alt="play" />
                            <img src="../../assets/images/icon/pause.png" alt="pause" />
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
import 'swiper/css';

import testImg from '@/assets/images/main/shorts/shorts_img1.png';

export default {
    name: 'TestView',
    components: { MainContainer, Swiper, SwiperSlide },
    data() {
        return {
            shorts: Array.from({ length: 8 }).map(() => ({
                title: '멸종위기사랑',
                artist: '이찬혁',
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

<style scoped src="../../assets/styles/pages/main-css/sec-07.css"></style>
