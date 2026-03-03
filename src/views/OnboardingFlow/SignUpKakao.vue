<template>
    <main>
        <div class="container">
            <div class="row g-9 title">
                <div class="col-1 color-primary">
                    <h2 class="font-24 fw-semibold">회원가입</h2>
                </div>
                <div class="col-1">
                    <p class="color-black fw-medium op-50">
                        1억명이 선택한 글로벌 음악 스트리밍 사이트, <br />
                        뮤트에 지금 가입하세요
                    </p>
                </div>
            </div>
        </div>
        <div class="container">
            <form action="#" method="post" class="row g-15">
                <BaseInput
                    title="닉네임"
                    icon="person"
                    placeholder="닉네임을 입력하세요"
                    id="login-name"
                    name="name"
                    type="text"
                    :showcheck="true"
                />
                <BaseInput
                    title="이메일"
                    icon="mail"
                    placeholder="이메일을 입력하세요"
                    id="login-email"
                    name="email"
                    type="text"
                    :showcheck="false"
                />
                <BaseInput
                    title="전화번호"
                    icon="call"
                    placeholder="전화번호를 입력하세요"
                    id="login-phone"
                    name="phone"
                    type="text"
                    :showcheck="false"
                />
                <BaseInput
                    title="비밀번호"
                    icon="lock"
                    placeholder="비밀번호를 입력하세요"
                    id="login-pass"
                    name="pass"
                    type="password"
                    :showcheck="false"
                />
                <BaseInput
                    title="비밀번호 재입력"
                    icon="lock"
                    placeholder="비밀번호를 다시 입력하세요"
                    id="login-confirm-pass"
                    name="pass"
                    type="password"
                    :showcheck="false"
                />
                <div class="col-1 terms-check">
                    <input type="checkbox" id="terms" />
                    <label for="terms" class="color-primary-2 fw-medium font-12"
                        >뮤트에서 제공하는 서비스 약관에 동의합니다.</label
                    >
                </div>
                <div class="col-1">
                    <router-link to="/signup-info">
                        <BaseButton class="login-btn" label="가입하기" variant="active"
                    /></router-link>
                </div>
                <div class="col-1 social-login">
                    <p class="text-center">소셜 계정으로 가입하기</p>
                </div>
            </form>
            <div class="row g-24 social-login-icon">
                <a href="#" class="social-icon" @click.prevent="kakaoLogin">
                    <img :src="kakao" alt="kakao" />
                </a>
                <img :src="google" alt="google" />
                <img :src="apple" alt="apple" />
            </div>
        </div>
        <button @click="kakaoLogout">카카오 로그아웃</button>
        <button @click="kakaoUnlink">카카오 연결 해제</button>
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import kakao from '@/assets/images/signup/kakao.png';
import google from '@/assets/images/signup/google.png';
import apple from '@/assets/images/signup/apple.png';

const error = ref('');

function ensureKakaoInit() {
    console.log('Kakao exists?', !!window.Kakao);
    console.log('Initialized?', window.Kakao?.isInitialized?.());
    console.log('JS KEY:', process.env.VUE_APP_KAKAO_JS_KEY);
    const jsKey = process.env.VUE_APP_KAKAO_JS_KEY;

    if (!jsKey) {
        throw new Error('VUE_APP_KAKAO_JS_KEY가 .env에 없습니다.');
    }
    if (!window.Kakao) {
        throw new Error('Kakao SDK가 로드되지 않았습니다. public/index.html에 kakao.js 넣었는지 확인하세요.');
    }
    if (!window.Kakao.isInitialized()) {
        window.Kakao.init(jsKey);
    }
}

onMounted(() => {
    try {
        ensureKakaoInit();
    } catch (e) {
        error.value = e.message ?? String(e);
        console.error(e);
    }
});

function kakaoLogin() {
    try {
        ensureKakaoInit();

        window.Kakao.Auth.login({
            scope: 'profile_nickname,profile_image', // 필요하면 account_email 추가
            success: (authObj) => {
                console.log('kakao login success:', authObj);

                // 유저 정보 확인(테스트)
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: (res) => {
                        console.log('kakao user:', res);
                        // TODO: 여기서 res를 서버로 보내서 회원가입/로그인 처리
                        // 필요하면 router.push('/signup-info') 같은 식으로 다음 단계 이동
                    },
                    fail: (err) => {
                        console.error(err);
                        error.value = '유저 정보 조회 실패';
                    }
                });
            },
            fail: (err) => {
                console.error(err);
                error.value = '카카오 로그인 실패';
            }
        });
    } catch (e) {
        error.value = e.message ?? String(e);
        console.error(e);
    }
}

// ✅ 로그아웃
function kakaoLogout() {
    if (!window.Kakao || !window.Kakao.isInitialized()) return;

    if (window.Kakao.Auth.getAccessToken()) {
        window.Kakao.Auth.logout(() => {
            console.log('카카오 로그아웃 완료');
        });
    } else {
        console.log('이미 로그아웃 상태');
    }
}
function kakaoUnlink() {
    if (!window.Kakao || !window.Kakao.isInitialized()) return;

    // 토큰 있는지 체크
    const token = window.Kakao.Auth.getAccessToken();
    if (!token) {
        console.log('토큰 없음: 먼저 로그인해야 unlink 가능');
        return;
    }

    window.Kakao.API.request({
        url: '/v1/user/unlink',
        success: (res) => {
            console.log('연결 해제 성공', res);
            // 로컬 토큰 정리
            window.Kakao.Auth.setAccessToken(null);
        },
        fail: (err) => {
            console.error('연결 해제 실패', err);
        }
    });
}
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/signup-view.css"></style>
