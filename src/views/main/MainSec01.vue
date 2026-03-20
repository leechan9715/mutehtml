<template>
    <section class="container" id="lsc">
        <div class="row content1">
            <div class="col-2">
                <div class="content-text-1">
                    <h2 class="color-key fw-semibold">구름 조금</h2>
                    <h3>3°/ 경기도 안산시</h3>
                </div>
                <div class="content-text-2">
                    <p>흐린날의 채도를 높여줄,</p>
                    <p>당신만을 위한 딥한 선곡</p>
                </div>
                <div class="content-text-3">
                    <p class="color-key fw-semibold">#시티팝 &nbsp;&nbsp;#어쿠스틱 &nbsp;&nbsp;#Lo-fi</p>
                </div>
            </div>

            <div class="col-2 lp-col">
                <div class="lp-wrap">
                    <img src="@/assets/images/main/lp.png" alt="lp판" class="lp" :class="{ playing: isPlaying }" />

                    <button class="play-btn" :aria-label="isPlaying ? '일시정지' : '재생'" @click="togglePlay">
                        <svg viewBox="0 0 100 100" class="play-svg">
                            <polygon class="icon" points="28,20 28,80 52,65 52,35">
                                <animate
                                    ref="toPauseLeft"
                                    attributeName="points"
                                    dur="220ms"
                                    fill="freeze"
                                    calcMode="spline"
                                    keySplines="0.4 0 0.2 1"
                                    begin="indefinite"
                                    to="24,20 24,80 42,80 42,20"
                                />
                                <animate
                                    ref="toPlayLeft"
                                    attributeName="points"
                                    dur="220ms"
                                    fill="freeze"
                                    calcMode="spline"
                                    keySplines="0.4 0 0.2 1"
                                    begin="indefinite"
                                    to="28,20 28,80 52,65 52,35"
                                />
                            </polygon>

                            <polygon class="icon" points="52,35 52,65 76,50 76,50">
                                <animate
                                    ref="toPauseRight"
                                    attributeName="points"
                                    dur="220ms"
                                    fill="freeze"
                                    calcMode="spline"
                                    keySplines="0.4 0 0.2 1"
                                    begin="indefinite"
                                    to="58,20 58,80 76,80 76,20"
                                />
                                <animate
                                    ref="toPlayRight"
                                    attributeName="points"
                                    dur="220ms"
                                    fill="freeze"
                                    calcMode="spline"
                                    keySplines="0.4 0 0.2 1"
                                    begin="indefinite"
                                    to="52,35 52,65 76,50 76,50"
                                />
                            </polygon>
                        </svg>
                    </button>
                </div>
                <img src="@/assets/images/main/cloud.png" alt="cloud" class="cloud-img-1" />
                <img src="@/assets/images/main/cloud.png" alt="cloud" class="cloud-img-2" />
            </div>
        </div>

        <div class="row swipe-ani">
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
            isPlaying: false
        };
    },
    methods: {
        selectTag(e) {
            const el = e.currentTarget.querySelector('h4');

            el.classList.add('active');

            setTimeout(() => {
                el.classList.remove('active');
            }, 150);
        },

        togglePlay() {
            this.isPlaying = !this.isPlaying;

            if (this.isPlaying) {
                this.$refs.toPauseLeft.beginElement();
                this.$refs.toPauseRight.beginElement();
            } else {
                this.$refs.toPlayLeft.beginElement();
                this.$refs.toPlayRight.beginElement();
            }
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/main-css/sec-01.css"></style>
