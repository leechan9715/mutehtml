<template>
    <div class="app">
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
                @mousedown="index === 0 ? startDrag($event) : null"
                @touchstart="index === 0 ? startDrag($event) : null"
            >
                <div class="card-top">
                    <img :src="card.mainImage" :alt="`${card.name} 대표 이미지`" />
                </div>

                <div class="card-bottom">
                    <div class="info-area">
                        <h2 class="artist-name">{{ card.name }}</h2>
                        <p class="artist-meta">{{ card.meta }}</p>
                        <p class="artist-feature">{{ card.feature }}</p>
                        <div class="link-row">아티스트 곡 듣기 &gt;</div>
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
                    name: '가수이름 1',
                    meta: '나이 | 성별 | 태어난나라',
                    feature: '특징',
                    mainImage: img01,
                    thumbImage: img02
                },
                {
                    id: 2,
                    name: '가수이름 2',
                    meta: '나이 | 성별 | 태어난나라',
                    feature: '특징',
                    mainImage: img03,
                    thumbImage: img04
                },
                {
                    id: 3,
                    name: '가수이름 3',
                    meta: '나이 | 성별 | 태어난나라',
                    feature: '특징',
                    mainImage: img05,
                    thumbImage: img06
                },
                {
                    id: 4,
                    name: '가수이름 4',
                    meta: '나이 | 성별 | 태어난나라',
                    feature: '특징',
                    mainImage: img07,
                    thumbImage: img08
                }
            ],
            isDragging: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        };
    },
    computed: {
        visibleCards() {
            return this.cards.slice(0, 3);
        }
    },
    methods: {
        getPoint(event) {
            if (event.touches && event.touches.length > 0) {
                return {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
            }

            return {
                x: event.clientX,
                y: event.clientY
            };
        },

        startDrag(event) {
            const point = this.getPoint(event);

            this.isDragging = true;
            this.startX = point.x;
            this.startY = point.y;
            this.currentX = 0;
            this.currentY = 0;

            window.addEventListener('mousemove', this.onDrag);
            window.addEventListener('mouseup', this.endDrag);
            window.addEventListener('touchmove', this.onDrag, { passive: false });
            window.addEventListener('touchend', this.endDrag);
        },

        onDrag(event) {
            if (!this.isDragging) return;

            if (event.cancelable) event.preventDefault();

            const point = this.getPoint(event);
            this.currentX = point.x - this.startX;
            this.currentY = point.y - this.startY;
        },

        endDrag() {
            if (!this.isDragging) return;

            const threshold = 100;

            if (Math.abs(this.currentX) > threshold) {
                const direction = this.currentX > 0 ? 1 : -1;
                this.currentX = direction * 520;
                this.currentY += 40;

                setTimeout(() => {
                    const first = this.cards.shift();
                    this.cards.push(first);
                    this.resetDrag();
                }, 240);
            } else {
                this.resetDrag();
            }

            window.removeEventListener('mousemove', this.onDrag);
            window.removeEventListener('mouseup', this.endDrag);
            window.removeEventListener('touchmove', this.onDrag);
            window.removeEventListener('touchend', this.endDrag);
        },

        resetDrag() {
            this.isDragging = false;
            this.currentX = 0;
            this.currentY = 0;
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
        window.removeEventListener('mousemove', this.onDrag);
        window.removeEventListener('mouseup', this.endDrag);
        window.removeEventListener('touchmove', this.onDrag);
        window.removeEventListener('touchend', this.endDrag);
    }
};
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.app {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
}

.card-stack {
    position: relative;
    width: 320px;
    height: 520px;
}

.artist-card {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    overflow: hidden;
    background: #d9d9d9;
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
    user-select: none;
    touch-action: none;
}

.artist-card.top {
    cursor: grab;
}

.artist-card.dragging {
    cursor: grabbing;
}

.card-top {
    height: 63%;
    background: #f3f3f3;
    overflow: hidden;
}

.card-top img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.card-bottom {
    height: 37%;
    background: #d9d9d9;
    padding: 22px 18px 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
}

.info-area {
    flex: 1;
    min-width: 0;
}

.artist-name {
    margin: 0 0 14px;
    font-size: 18px;
    font-weight: 700;
    color: #111;
}

.artist-meta {
    margin: 0 0 12px;
    font-size: 14px;
    color: #222;
    line-height: 1.4;
}

.artist-feature {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #222;
}

.link-row {
    margin-top: 42px;
    font-size: 14px;
    color: #111;
    text-align: center;
}

.thumb-area {
    width: 74px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-self: flex-end;
}

.thumb-box {
    width: 74px;
    height: 74px;
    border-radius: 4px;
    overflow: hidden;
    background: #f3f3f3;
}

.thumb-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
</style>
