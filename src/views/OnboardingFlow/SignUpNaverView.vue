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
                <img :src="facebook" alt="facebook" />
                <img :src="google" alt="google" />
                <img :src="apple" alt="apple" />
                <div id="naverIdLogin" v-show="!accessToken"></div>
                <button v-if="accessToken" type="button" @click="logout">로그아웃</button>
            </div>
        </div>
    </main>
</template>

<script setup>
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import facebook from '@/assets/images/signup/facebook.png';
import google from '@/assets/images/signup/google.png';
import apple from '@/assets/images/signup/apple.png';
import { ref, onMounted, nextTick } from 'vue';

// ✅ 상태
const naverLogin = ref(null); // 네이버 로그인 객체
const accessToken = ref(null); // 발급받은 access token

// ✅ (Vue CLI 기준) 환경변수로 빼는 걸 추천
// .env.local:
// VUE_APP_NAVER_CLIENT_ID=xxxx
// VUE_APP_NAVER_CALLBACK_URL=http://localhost:8080/naverlogin
const NAVER_CLIENT_ID = process.env.VUE_APP_NAVER_CLIENT_ID;
const CALLBACK_URL = process.env.VUE_APP_NAVER_CALLBACK_URL;

// ✅ 네이버 로그인 버튼 초기화
function initializeNaverLoginButton() {
    try {
        if (!window?.naver?.LoginWithNaverId) {
            console.error('네이버 SDK가 아직 로드되지 않았습니다. (window.naver 없음)');
            return;
        }

        naverLogin.value = new window.naver.LoginWithNaverId({
            clientId: NAVER_CLIENT_ID,
            callbackUrl: CALLBACK_URL,
            isPopup: false,
            loginButton: { color: 'green', type: 3, height: 60 }
        });

        naverLogin.value.init();

        // SDK 초기화 후 로그인 상태 확인
        naverLogin.value.getLoginStatus((status) => {
            if (status) checkLoginStatus();
            else console.log('로그인되지 않은 상태입니다.');
        });
    } catch (error) {
        console.log('네이버 로그인 초기화 중 오류발생:', error);
    }
}

// ✅ 로그인 상태 확인 + 사용자 정보 가져오기
function checkLoginStatus() {
    if (!naverLogin.value) {
        console.error('네이버 로그인 객체가 초기화 되지 않았습니다.');
        return;
    }

    naverLogin.value.getLoginStatus((status) => {
        if (!status) {
            console.log('callback 처리에 실패하였습니다.');
            return;
        }

        const email = naverLogin.value.user?.getEmail?.();
        if (!email) {
            alert('이메일은 필수정보입니다. 정보제공을 동의해주세요');
            naverLogin.value.reprompt?.();
            return;
        }

        // access token 저장 (SDK 구조가 케이스마다 달라서 안전하게)
        accessToken.value = naverLogin.value.accessToken?.accessToken || naverLogin.value.accessToken || null;

        console.log('로그인 성공!', email);
    });
}

// ✅ 로그아웃: access token 삭제는 "백엔드"에서 처리 추천
function logout() {
    if (!accessToken.value) {
        console.log('로그인 상태가 아닙니다.');
        return;
    }
    const logoutUrl = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=mtjjmyTeqJxD3JTzSSKD&client_secret=1WUIDotelN&access_token=${accessToken.value}&service_provider=NAVER`;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = logoutUrl;
    document.body.appendChild(iframe);

    // ✅ 네이버 SDK가 저장한 sessionStorage 직접 삭제
    sessionStorage.removeItem('com.naver.nid.access_token');
    sessionStorage.removeItem('com.naver.nid.oauth.state_token');

    accessToken.value = null;

    nextTick(() => {
        initializeNaverLoginButton();
    });

    console.log('로그아웃 요청이 실행되었습니다.');
}

onMounted(() => {
    initializeNaverLoginButton();
});
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/signup-view.css"></style>
