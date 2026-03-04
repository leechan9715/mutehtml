<template>
    <section class="container" id="lsc">
        <div class="row content1">
            <div class="col-2">
                <div class="content-text-1">
                    <h2 class="color-primary-4 fw-medium">구름 조금</h2>
                    <h3>3°/ 경기도 안산시</h3>
                </div>
                <div class="content-text-2">
                    <p>흐린날의 채도를 높여줄,</p>
                    <p>당신만을 위한 딥한 선곡</p>
                </div>
                <div class="content-text-3">
                    <p class="color-primary-4 fw-medium font-14">#시티팝 &nbsp;&nbsp;#어쿠스틱 &nbsp;&nbsp;#Lo-fi</p>
                </div>
            </div>
            <div class="col-2">
                <img src="@/assets/images/main/lp.png" alt="lp판" class="lp" />
                <img src="@/assets/images/main/play-white.png" alt="play" class="play-img" />
            </div>
            <img src="@/assets/images/main/cloud.png" alt="cloud" class="cloud-img-1" />
            <img src="@/assets/images/main/cloud.png" alt="cloud" class="cloud-img-2" />
            <img src="@/assets/images/main/cloud.png" alt="cloud" class="cloud-img-3" />
        </div>
        <div class="row">
            <Swiper class="lsc-swiper-1" :slides-per-view="'auto'" :space-between="10">
                <SwiperSlide v-for="(tag, i) in tags" :key="i" class="tag-slide" @click="selectTag($event)">
                    <h4>{{ tag }}</h4>
                </SwiperSlide>
            </Swiper>
        </div>
    </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    data() {
        return {
            tags: [
                '운동',
                '출퇴근길',
                '잔잔하게',
                '드라이브',
                'K-POP',
                '운동',
                '출퇴근길',
                '잔잔하게',
                '드라이브',
                'K-POP'
            ],
            selectedTagIndex: null
        };
    },
    methods: {
        selectTag(e) {
            const el = e.currentTarget.querySelector('h4');

            el.classList.add('active');

            setTimeout(() => {
                el.classList.remove('active');
            }, 150);
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/main-css/sec-01.css"></style>
