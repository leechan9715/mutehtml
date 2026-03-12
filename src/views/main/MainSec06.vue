<template>
    <div class="app">
        <div class="title-explain fw-600 color-black">
            <p>오늘의 아티스트 추천</p>
        </div>
        <div class="card-stack">
            <div
                v-for="(card, index) in visibleCards"
                :key="card.id"
                class="artist-card"
                :class="{
                    top: index === 0,
                    dragging: index === 0 && isDragging
                }"
                :style="getCardStyle(index)"
            >
                <div class="card-top" @pointerdown="index === 0 ? startDrag($event) : null">
                    <img :src="card.mainImage" :alt="`${card.name} 대표 이미지`" />
                </div>

                <div class="card-bottom">
                    <div class="info-area">
                        <h2 class="artist-name">{{ card.name }}</h2>
                        <p class="artist-meta">{{ card.meta }}</p>
                        <p class="artist-feature">{{ card.feature }}</p>
                        <div class="link-row">곡 듣기 &gt;</div>
                    </div>

                    <div class="thumb-area">
                        <div class="thumb-box">
                            <img :src="card.thumbImage" :alt="`${card.name} 썸네일`" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import img01 from '@/assets/images/main/sec06/img01.png';
import img02 from '@/assets/images/main/sec06/img02.png';
import img03 from '@/assets/images/main/sec06/img03.png';
import img04 from '@/assets/images/main/sec06/img04.png';
import img05 from '@/assets/images/main/sec06/img05.png';
import img06 from '@/assets/images/main/sec06/img06.png';
import img07 from '@/assets/images/main/sec06/img07.png';
import img08 from '@/assets/images/main/sec06/img08.png';

export default {
    name: 'ArtistCardStack',
    data() {
        return {
            cards: [
                {
                    id: 1,
                    name: 'Sabrina Carpenter',
                    meta: '26 | 여성 | 미국',
                    feature: '밝고 경쾌한 팝 사운드와 위트 있는 가사를 중심으로 한 트렌디한 미국 팝 아티스트.',
                    mainImage: img01,
                    thumbImage: img02
                },
                {
                    id: 2,
                    name: 'olivia rodrigo',
                    meta: '23 | 여성 | 미국',
                    feature: '10대 감정과 연애의 혼란을 솔직하게 표현하는 감정 중심의 팝·팝록 싱어송라이터.',
                    mainImage: img03,
                    thumbImage: img04
                },
                {
                    id: 3,
                    name: '아이유',
                    meta: '34 | 여성 | 대한민국',
                    feature: '서정적인 멜로디와 감성적인 보컬, 자작곡 중심의 스토리텔링이 강점인 아티스트.',
                    mainImage: img05,
                    thumbImage: img06
                },
                {
                    id: 4,
                    name: '윤하',
                    meta: '36 | 여성 | 대한민국',
                    feature: '폭발적인 고음과 록 기반 밴드 사운드를 특징으로 하는 파워풀한 여성 보컬.',
                    mainImage: img07,
                    thumbImage: img08
                }
            ],
            isDragging: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            activePointerId: null
        };
    },
    computed: {
        visibleCards() {
            return this.cards.slice(0, 3);
        }
    },
    methods: {
        startDrag(event) {
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            if (this.isDragging) return;

            this.isDragging = true;
            this.startX = event.clientX;
            this.startY = event.clientY;
            this.currentX = 0;
            this.currentY = 0;
            this.activePointerId = event.pointerId;

            if (event.currentTarget.setPointerCapture) {
                event.currentTarget.setPointerCapture(event.pointerId);
            }

            window.addEventListener('pointermove', this.onDrag);
            window.addEventListener('pointerup', this.endDrag);
            window.addEventListener('pointercancel', this.cancelDrag);
        },

        onDrag(event) {
            if (!this.isDragging) return;
            if (this.activePointerId !== null && event.pointerId !== this.activePointerId) return;

            this.currentX = event.clientX - this.startX;
            this.currentY = event.clientY - this.startY;
        },

        endDrag(event) {
            if (!this.isDragging) return;
            if (this.activePointerId !== null && event.pointerId !== this.activePointerId) return;

            const threshold = 100;

            if (Math.abs(this.currentX) > threshold) {
                const direction = this.currentX > 0 ? 1 : -1;

                this.currentX = direction * 520;
                this.currentY += 40;

                this.removePointerEvents();

                setTimeout(() => {
                    const first = this.cards.shift();
                    this.cards.push(first);
                    this.resetDrag();
                }, 240);
            } else {
                this.removePointerEvents();
                this.resetDrag();
            }
        },

        cancelDrag() {
            this.removePointerEvents();
            this.resetDrag();
        },

        removePointerEvents() {
            window.removeEventListener('pointermove', this.onDrag);
            window.removeEventListener('pointerup', this.endDrag);
            window.removeEventListener('pointercancel', this.cancelDrag);
        },

        resetDrag() {
            this.isDragging = false;
            this.currentX = 0;
            this.currentY = 0;
            this.activePointerId = null;
        },

        getCardStyle(index) {
            if (index === 0) {
                const rotate = this.currentX * 0.06;

                return {
                    transform: `translate(${this.currentX}px, ${this.currentY}px) rotate(${rotate}deg)`,
                    opacity: 1,
                    zIndex: 3,
                    transition: this.isDragging ? 'none' : 'transform 0.24s ease, opacity 0.24s ease'
                };
            }

            if (index === 1) {
                return {
                    transform: 'translateY(12px) scale(0.97)',
                    opacity: 0.92,
                    zIndex: 2,
                    transition: 'transform 0.24s ease, opacity 0.24s ease'
                };
            }

            return {
                transform: 'translateY(24px) scale(0.94)',
                opacity: 0.84,
                zIndex: 1,
                transition: 'transform 0.24s ease, opacity 0.24s ease'
            };
        }
    },
    beforeUnmount() {
        this.removePointerEvents();
    }
};
</script>

<style scoped src="../../assets/styles/pages/main-css/sec-06.css"></style>
