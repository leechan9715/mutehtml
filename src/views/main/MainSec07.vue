<template>
    <div style="padding: 16px">
        <MainContainer title="아티스트 모먼트">
            <Swiper class="song-swiper" :slides-per-view="3.2" :space-between="16">
                <SwiperSlide v-for="post in posts" :key="post.id" class="shorts" @click="linkTo(post.id)">
                    <video
                        style="object-fit: cover"
                        autoplay
                        muted
                        loop
                        playsinline
                        class="video"
                        :src="post.short_url"
                    ></video>
                    <div class="information">
                        <img :src="testImg" :alt="post.title" />
                        <div class="artist">
                            <p class="artist_song">{{ post.title }}</p>
                            <p class="artist_name">{{ post.content }}</p>
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
import { mainShortsApi } from '@/api/_music_api';

export default {
    name: 'TestView',
    components: { MainContainer, Swiper, SwiperSlide },
    data() {
        return {
            posts: [],
            testImg
        };
    },
    methods: {
        async getPostUrl() {
            try {
                const { data } = await mainShortsApi();
                this.posts = data.posts || [];
                console.log(this.posts);
            } catch (error) {
                console.error('게시글 불러오기 실패:', error);
            }
        },

        linkTo(id) {
            this.$router.push(`/videos/${id}`);
        }
    },
    mounted() {
        this.getPostUrl();
    }
};
</script>

<style scoped src="../../assets/styles/pages/main-css/sec-07.css"></style>
