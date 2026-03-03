<template>
    <main class="container">
        <div class="row">
            <div class="col-1">
                <p v-if="error">{{ error }}</p>
                <p v-else>카카오로 가입 진행중...</p>
            </div>
        </div>
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const error = ref('');

onMounted(() => {
    const code = route.query.code;

    // 1) 돌아왔는데 code가 있으면 -> 다음 단계로 이동(임시)
    if (code) {
        // TODO: 나중에 API로 code 보내서 회원가입 처리
        router.replace('/signup-info');
        return;
    }

    // 2) code 없으면 -> 카카오 인가 페이지로 이동
    const REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY; // (Vite 기준)
    const REDIRECT_URI = `${window.location.origin}/signup-kakao`;

    if (!REST_KEY) {
        error.value = 'VITE_KAKAO_REST_KEY가 .env에 없습니다.';
        return;
    }

    const url =
        `https://kauth.kakao.com/oauth/authorize` +
        `?response_type=code` +
        `&client_id=${encodeURIComponent(REST_KEY)}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

    window.location.href = url;
});
</script>
