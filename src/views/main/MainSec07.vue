<template>
    <div style="padding: 16px">
        <MainContainer title="아티스트 모먼트" @click="goNext">
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
            posts: [],
            testImg
        };
    },
    methods: {
        goNext() {
            console.log('헤더 클릭!');
        },

        async getPostUrl() {
            try {
                const result = await $api(`${process.env.VUE_APP_BASE_URL}/api/auth/videolist.php`, 'GET');
                this.posts = result.posts || [];
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
