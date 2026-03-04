<template>
    <div style="padding: 16px">
        <MainContainer title="당신을 위한 추천 : 락밴드" @click="goNext">
            <div class="col5" ref="col5">
                <img src="../../assets/images/main/albumSlide/cover1.png" alt="album_cover1" />
                <img src="../../assets/images/main/albumSlide/cover2.png" alt="album_cover2" />
                <img src="../../assets/images/main/albumSlide/cover3.png" alt="album_cover3" />
                <img src="../../assets/images/main/albumSlide/cover4.png" alt="album_cover4" />
                <img src="../../assets/images/main/albumSlide/cover5.png" alt="album_cover5" />
            </div>
        </MainContainer>
    </div>
</template>

<script>
import MainContainer from '@/components/ui/main-section-top.vue';

export default {
    name: 'forU',
    components: { MainContainer },
    mounted() {
        this.initSlider();
    },
    methods: {
        goNext() {
            console.log('헤더 클릭!');
        },
        initSlider() {
            const container = this.$refs.col5; // ← 여기만 바뀜\
            if (!container) return;

            const images = Array.from(container.querySelectorAll('img'));

            // ... 기존 변수들 ...
            let currentIndex = 0;
            let isDragging = false;
            let startX = 0;
            let dx = 0;
            let dragDir = 1;
            let tempIndex = 0;

            // ✅ 여기에 touch 변수도 같이 선언
            let touchStartX = 0;
            let touchDx = 0;
            let isTouching = false;

            if (!container) return;

            const basePositions = [
                { left: 0, zIndex: 100 },
                { left: 90, zIndex: 90 },
                { left: 162, zIndex: 80 },
                { left: 230, zIndex: 70 },
                { left: 290, zIndex: 60 }
            ];

            const MOVE_THRESHOLD = 90;
            const OFF_RIGHT = 635;
            const OFF_LEFT = -220;
            const PULL_STRENGTH = 0.35;
            const TRANSITION = 'left 1s cubic-bezier(0.22, 1, 0.36, 1)';

            function clamp01(v) {
                return Math.max(0, Math.min(1, v));
            }
            function lerp(a, b, t) {
                return a + (b - a) * t;
            }

            function updatePositions(index = currentIndex, progress = 0, dir = 1, animate = true) {
                const N = basePositions.length;
                const t = clamp01(progress);

                images.forEach((img, i) => {
                    const posIndex = (i - index + images.length) % images.length;
                    img.style.transition = animate ? TRANSITION : 'none';

                    if (posIndex >= N) {
                        img.style.left = (dir === 1 ? OFF_RIGHT : OFF_LEFT) + 'px';
                        img.style.zIndex = '10';
                        return;
                    }

                    const cur = basePositions[posIndex];
                    const neighborIndex = dir === 1 ? posIndex - 1 : posIndex + 1;

                    if (neighborIndex < 0 || neighborIndex >= N) {
                        img.style.left = cur.left + 'px';
                        img.style.zIndex = cur.zIndex;
                        return;
                    }

                    const next = basePositions[neighborIndex];
                    const tForThis = posIndex === 0 ? 0 : t * PULL_STRENGTH;
                    img.style.left = lerp(cur.left, next.left, tForThis) + 'px';
                    img.style.zIndex = cur.zIndex;
                });
            }

            function applyStepsFromDx(dxValue) {
                dragDir = dxValue < 0 ? 1 : -1;
                const absDx = Math.abs(dxValue);
                return {
                    steps: Math.floor(absDx / MOVE_THRESHOLD),
                    progress: (absDx % MOVE_THRESHOLD) / MOVE_THRESHOLD
                };
            }

            function computeTempIndex(baseIndex, steps, dir) {
                const delta = dir === 1 ? steps : -steps;
                return (baseIndex + delta + images.length) % images.length;
            }

            // 초기 스타일
            container.style.position = 'relative';
            container.style.height = '200px';
            container.style.userSelect = 'none';

            images.forEach((img) => {
                img.style.position = 'absolute';
                img.style.top = '0px';
                img.style.left = '0px';
                img.style.width = '165px';
                img.style.height = '165px';
                img.style.borderRadius = '20px';
                img.style.userSelect = 'none';
                img.style.transformOrigin = 'center center';
                img.draggable = false;
                img.style.pointerEvents = 'none';
            });

            updatePositions(currentIndex, 0, 1, false);
            requestAnimationFrame(() => updatePositions(currentIndex, 0, 1, true));

            function finalizeDrag() {
                currentIndex = tempIndex;
                updatePositions(currentIndex, 0, dragDir, true);
                startX = 0;
                dx = 0;
                isDragging = false;
            }

            // Mouse
            container.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.pageX;
                dx = 0;
                tempIndex = currentIndex;
                updatePositions(tempIndex, 0, 1, false);
            });
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                dx = e.pageX - startX;
                const { steps, progress } = applyStepsFromDx(dx);
                tempIndex = computeTempIndex(currentIndex, steps, dragDir);
                updatePositions(tempIndex, progress, dragDir, false);
            });
            window.addEventListener('mouseup', () => {
                if (isDragging) finalizeDrag();
            });
            container.addEventListener('mouseleave', () => {
                if (isDragging) finalizeDrag();
            });

            container.addEventListener('touchstart', (e) => {
                isTouching = true;
                touchStartX = e.touches[0].pageX;
                touchDx = 0;
                tempIndex = currentIndex;
                updatePositions(tempIndex, 0, 1, false);
            });
            container.addEventListener(
                'touchmove',
                (e) => {
                    if (!isTouching) return;
                    touchDx = e.touches[0].pageX - touchStartX;
                    const { steps, progress } = applyStepsFromDx(touchDx);
                    tempIndex = computeTempIndex(currentIndex, steps, dragDir);
                    updatePositions(tempIndex, progress, dragDir, false);
                    e.preventDefault();
                },
                { passive: false }
            );
            container.addEventListener('touchend', () => {
                if (!isTouching) return;
                dx = touchDx;
                finalizeDrag();
                isTouching = false;
                touchStartX = 0;
                touchDx = 0;
            });
        }
    }
};
</script>

<style scoped src="../../assets/styles/pages/main-css/sec-04.css"></style>
