<template>
    <div style="padding: 16px">
        <MainContainer title="아티스트 모먼트" @click="goNext">
            <Swiper class="song-swiper" :slides-per-view="3.2" :space-between="16">
                <SwiperSlide v-for="(short, i) in shorts" :key="i" class="shorts" @click="linkTo()">
                    <video
                        autoplay
                        muted
                        loop
                        playsinline
                        v-if="results"
                        class="video"
                        :src="results.post.video_url"
                    ></video>
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
import { $api } from '@/mixins/mixins';
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
            })),
            id: '1',
            results: null
        };
    },
    methods: {
        goNext() {
            console.log('헤더 클릭!');
        },

        async getPostUrl() {
            const result = await $api(`http://localhost/test/api/auth/videos.php`, 'GET', { id: this.id });
            this.results = result;
            console.log(this.results);
        },
        linkTo() {
            this.$router.push(`/videos/${this.id}`);
        }
    },
    mounted() {
        this.getPostUrl();
    }
};
</script>

<style scoped src="../../assets/styles/pages/main-css/sec-07.css"></style>
