<template>
    <main>
        <div class="container">
            <div class="row">
                <!-- ✅ 기존 logo_box 전체 삭제하고 컴포넌트로 대체 -->
                <Logo />

                <div class="col-1">
                    <h2 class="text-center fw-bold color-primary-3">LOADING...</h2>
                    <p class="text-center fw-bold">
                        뮤트가<span class="fw-semibold"> 홍길동</span>님을 위한 노래를 고르고 있습니다.
                        <span>{{ percent }}</span
                        >%
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import Logo from '@/components/ui/Logo.vue'; // ✅ 경로는 실제 위치에 맞게

export default {
    components: {
        Logo // ✅ 등록
    },
    data() {
        return {
            percent: 0,
            currentTime: ''
        };
    },
    mounted() {
        // 퍼센트 카운터
        const loading = setInterval(() => {
            this.percent++;
            if (this.percent >= 100) clearInterval(loading);
        }, 30);

        // 시간 업데이트
        this.updateTime();
        setInterval(this.updateTime, 1000);

        // ✅ 눈/입 애니메이션은 Logo 컴포넌트 안에서 처리하므로 여기서 제거
    },
    methods: {
        updateTime() {
            const now = new Date();
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            this.currentTime = `${hour}:${minute}`;
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/loading.css"></style>
