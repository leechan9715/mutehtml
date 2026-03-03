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
                    <label for="terms" class="color-primary-2 fw-medium font-12">
                        뮤트에서 제공하는 서비스 약관에 동의합니다.
                    </label>
                </div>

                <div class="col-1">
                    <router-link to="/signup-info">
                        <BaseButton class="login-btn" label="가입하기" variant="active" />
                    </router-link>
                </div>

                <div class="col-1 social-login">
                    <p class="text-center">소셜 계정으로 가입하기</p>
                </div>
            </form>

            <div class="row g-24 social-login-icon">
                <img :src="facebook" alt="facebook" />
                <img :src="googleIcon" alt="google" />
                <img :src="apple" alt="apple" />
            </div>

            <!-- Google 로그인 버튼: 버튼 자체를 v-if / v-else로 분기 (중첩 버튼/깨진 DOM 방지) -->
            <button v-if="!isLoggedIn" type="button" class="gsi-material-button" @click="login">
                <div class="gsi-material-button-state"></div>
                <div class="gsi-material-button-content-wrapper">
                    <div class="gsi-material-button-icon">
                        <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            style="display: block"
                            width="20"
                        >
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            ></path>
                            <path
                                fill="#4285F4"
                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                            ></path>
                            <path
                                fill="#FBBC05"
                                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                            ></path>
                            <path
                                fill="#34A853"
                                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                            ></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                    </div>
                    <span style="display: none">Sign in with Google</span>
                </div>
            </button>

            <button v-else type="button" @click="logout">로그아웃</button>
        </div>
    </main>
</template>

<script setup>
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

import facebook from '@/assets/images/signup/facebook.png';
import googleIcon from '@/assets/images/signup/google.png';
import apple from '@/assets/images/signup/apple.png';

import { ref } from 'vue';
import { googleSdkLoaded } from 'vue3-google-login';

const isLoggedIn = ref(false);
const oauthClientId = process.env.VUE_APP_OAUTH_CLIENT;

const login = () => {
    googleSdkLoaded((google) => {
        google.accounts.oauth2
            .initCodeClient({
                client_id: oauthClientId,
                scope: 'email profile openid',
                callback: (response) => {
                    console.log('로그인 성공', response);
                    isLoggedIn.value = true;
                }
            })
            .requestCode();
    });
};

const logout = () => {
    console.log('로그아웃');
    isLoggedIn.value = false;
};

console.log('client id:', oauthClientId);
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/signup-view.css"></style>
