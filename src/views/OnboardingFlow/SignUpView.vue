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
            <form action="#" method="post" class="row g-15" @submit.prevent="registerUser">
                <BaseInput
                    title="닉네임"
                    icon="person"
                    placeholder="닉네임을 입력하세요"
                    id="login-name"
                    name="nickname"
                    type="text"
                    :showcheck="true"
                    v-model="nickname"
                    @check="handleNicknameCheck"
                />
                <BaseInput
                    title="이메일"
                    icon="mail"
                    placeholder="이메일을 입력하세요"
                    id="login-email"
                    name="email"
                    type="text"
                    :showcheck="false"
                    v-model="email"
                />
                <BaseInput
                    title="전화번호"
                    icon="call"
                    placeholder="전화번호를 입력하세요"
                    id="login-phone"
                    name="phone"
                    type="text"
                    :showcheck="false"
                    v-model="phone"
                />
                <BaseInput
                    title="비밀번호"
                    icon="lock"
                    placeholder="비밀번호를 입력하세요"
                    id="login-pass"
                    name="password"
                    type="password"
                    :showcheck="false"
                    v-model="password"
                />
                <BaseInput
                    title="비밀번호 재입력"
                    icon="lock"
                    placeholder="비밀번호를 다시 입력하세요"
                    id="login-confirm-pass"
                    name="pass"
                    type="password"
                    :showcheck="false"
                    v-model="confirmPassword"
                />
                <div class="col-1 terms-check">
                    <input type="checkbox" id="terms" v-model="terms" />
                    <label for="terms" class="color-primary-2 fw-medium font-14"
                        >뮤트에서 제공하는 서비스 약관에 동의합니다.</label
                    >
                </div>
                <div class="col-1">
                    <BaseButton @click.prevent="registerUser" class="login-btn" label="가입하기" variant="active" />
                </div>
                <div class="col-1 social-login">
                    <p class="text-center color-black">SNS 계정으로 간편하게 가입하기</p>
                </div>
            </form>
            <div class="row g-24 social-login-icon">
                <img @click.prevent="kakaoLogin" :src="kakao" alt="kakao" />
                <img @click.prevent="startGoogleLogin" :src="google" alt="google" />
                <img @click.prevent="openNaverLogin" :src="naver" alt="naver" />
                <div id="naverIdLogin" class="hidden"></div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useAuthStore } from '@/store/auth';
import { googleSdkLoaded } from 'vue3-google-login';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

import kakao from '@/assets/images/signup/kakao.png';
import google from '@/assets/images/signup/google.png';
import naver from '@/assets/images/signup/naver.png';
import { onMounted, nextTick, ref, watch } from 'vue';

/* 일반 로그인 */
import { useRouter } from 'vue-router';
import { checkNickname } from '@/api/auth';
const router = useRouter();
/* 일반 회원가입 */
const nickname = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const terms = ref(false);
const nicknameChecked = ref(false);
const nicknameCheckText = ref('중복확인');

const auth = useAuthStore();
const error = ref('');
const naverLogin = ref(null);
const googleOauthClientId = process.env.VUE_APP_OAUTH_CLIENT;
const NAVER_CLIENT_ID = process.env.VUE_APP_NAVER_CLIENT_ID;
const NAVER_LOCAL_CALLBACK_URL = process.env.VUE_APP_LOCAL_NAVER_CALLBACK_URL;
const NAVER_DOTHOME_CALLBACK_URL = process.env.VUE_APP_DOTHOME_NAVER_CALLBACK_URL;
const KAKAO_JS_KEY = process.env.VUE_APP_KAKAO_JS_KEY;

//  구글 로그인 //
const startGoogleLogin = () => {
    googleSdkLoaded((google) => {
        google.accounts.oauth2
            .initTokenClient({
                client_id: googleOauthClientId,
                scope: 'email profile openid',
                callback: (response) => {
                    if (response.error) {
                        console.error('구글 로그인 실패:', response.error);
                        error.value = '구글 로그인에 실패했습니다.';
                        return;
                    }
                    console.log('구글 로그인 성공', response);
                    auth.isLoggedIn = true;
                    auth.provider = 'google';
                    auth.AccessToken = response.access_token ?? null;
                    localStorage.setItem(
                        'login-check',
                        JSON.stringify({
                            AccessToken: response.access_token,
                            provider: auth.provider,
                            isLoggedIn: auth.isLoggedIn
                        })
                    );
                    router.push('/welcome');
                }
            })
            .requestAccessToken();
    });
};

// 네이버 로그인
function initNaverButton() {
    const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    const callbackUrl = isLocal ? NAVER_LOCAL_CALLBACK_URL : NAVER_DOTHOME_CALLBACK_URL;
    try {
        if (!window?.naver?.LoginWithNaverId) {
            console.error('네이버 SDK가 아직 로드되지 않았습니다.');
            return;
        }
        naverLogin.value = new window.naver.LoginWithNaverId({
            clientId: NAVER_CLIENT_ID,
            callbackUrl: callbackUrl, // 콜백 URL로 이동
            isPopup: false, // 팝업 방식

            loginButton: { color: 'green', type: 3, height: 60 }
        });

        naverLogin.value.init(); // ✅ #naverIdLogin 안에 <a> 버튼이 생김

        naverLogin.value.getLoginStatus((status) => {
            if (status) checkLoginStatus();
            else console.log('로그인되지 않은 상태입니다.');
        });
    } catch (e) {
        console.log('네이버 로그인 초기화 오류:', e);
    }
}
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
        const token = naverLogin.value.accessToken?.accessToken || naverLogin.value.accessToken || null;
        auth.AccessToken = token;
        auth.isLoggedIn = true;
        auth.provider = 'naver';
        // 상단값 로컬스토리지에 저장
        localStorage.setItem(
            'login-check',
            JSON.stringify({
                AccessToken: auth.AccessToken,
                provider: auth.provider,
                isLoggedIn: auth.isLoggedIn
            })
        );
        router.push('/welcome');
        console.log('로그인 성공!', email);
    });
}

// ✅ 이미지 클릭 → 숨겨진 SDK 버튼(<a>) 클릭 → 로그인 팝업 뜸
async function openNaverLogin() {
    await nextTick();
    const aTag = document.querySelector('#naverIdLogin a');
    if (!aTag) {
        console.error('네이버 로그인 버튼이 아직 생성되지 않았습니다. (init 먼저 필요)');
        return;
    }
    aTag.click();
}
// KaKao 로그인

function ensureKakaoInit() {
    if (!KAKAO_JS_KEY) throw new Error('VUE_APP_KAKAO_JS_KEY가 .env에 없습니다.');
    if (!window.Kakao)
        throw new Error('Kakao SDK가 로드되지 않았습니다. public/index.html에 kakao.js 넣었는지 확인하세요.');
    if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);
}

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
                        router.push('/welcome');
                        auth.isLoggedIn = true;
                        auth.provider = 'kakao';
                        localStorage.setItem(
                            'login-check',
                            JSON.stringify({
                                AccessToken: null,
                                provider: auth.provider,
                                isLoggedIn: auth.isLoggedIn
                            })
                        );
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
console.log('저장된 값:', JSON.parse(localStorage.getItem('login-check')));

onMounted(async () => {
    await nextTick();
    initNaverButton();
});
/* 일반 회원가입 - 닉네임 중복확인 */

watch(nickname, () => {
    nicknameChecked.value = false;
    nicknameCheckText.value = '중복확인';
});
const handleNicknameCheck = async () => {
    const value = nickname.value.trim();
    if (!value) {
        alert('닉네임을 입력하세요.');
        return;
    }

    nicknameChecked.value = false;
    nicknameCheckText.value = '확인중...';

    try {
        const res = await checkNickname(value);
        if (res.data.available) {
            nicknameChecked.value = true;
            nicknameCheckText.value = '사용가능';
            alert('사용 가능한 닉네임입니다.');
        } else {
            nicknameCheckText.value = '중복';
            alert('이미 사용 중인 닉네임입니다.');
        }
    } catch (e) {
        nicknameCheckText.value = '중복확인';
        alert('중복확인 실패');
    }
};

/* 일반 회원가입 - 폼 제출 */
const registerUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,12}$/;

    if (!nicknameRegex.test(nickname.value)) {
        alert('닉네임은 2~12자의 한글/영문/숫자만 가능합니다.');
        return;
    }
    if (!emailRegex.test(email.value)) {
        alert('올바른 이메일 형식이 아닙니다.');
        return;
    }
    if (!phoneRegex.test(phone.value)) {
        alert('올바른 전화번호 형식이 아닙니다.');
        return;
    }
    if (!passwordRegex.test(password.value)) {
        alert('비밀번호는 영문 + 숫자 포함 8자 이상이어야 합니다.');
        return;
    }
    if (password.value !== confirmPassword.value) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    if (!terms.value) {
        alert('약관에 동의해주세요.');
        return;
    }
    if (!nicknameChecked.value) {
        alert('닉네임 중복확인을 해주세요.');
        return;
    }

    try {
        /* 일반 회원가입 */
        await auth.register({
            nickname: nickname.value, // 표시 닉네임
            email: email.value,
            phone: phone.value,
            password: password.value
        });
        alert('회원가입 성공');
        router.push('/welcome');
    } catch (e) {
        alert('회원가입 실패');
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/signup-view.css"></style>
