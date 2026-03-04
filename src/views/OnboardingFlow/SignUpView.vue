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
                    name="name"
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
                    name="pass"
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
                    <label for="terms" class="color-primary-2 fw-medium font-12"
                        >뮤트에서 제공하는 서비스 약관에 동의합니다.</label
                    >
                </div>
                <div class="col-1">
                    <BaseButton class="login-btn" label="가입하기" variant="active" type="submit" />
                </div>
                <div class="col-1 social-login">
                    <p class="text-center">소셜 계정으로 가입하기</p>
                </div>
            </form>
            <div class="row g-24 social-login-icon">
                <img :src="kakao" alt="kakao" />
                <img :src="google" alt="google" />
                <img :src="naver" alt="naver" />
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { checkNickname } from '@/api/auth';

import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

import kakao from '@/assets/images/signup/kakao.png';
import google from '@/assets/images/signup/google.png';
import naver from '@/assets/images/signup/naver.png';

const store = useStore();
const router = useRouter();

const nickname = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const terms = ref(false);
const nicknameChecked = ref(false);
const nicknameCheckText = ref('중복확인');

const handleNicknameCheck = async () => {
    nicknameChecked.value = false;
    nicknameCheckText.value = '확인중...';

    try {
        const res = await checkNickname(nickname.value.trim());
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
        await store.dispatch('auth/register', {
            username: email.value,
            password: password.value,
            email: email.value,
            phone: phone.value,
            nickname: nickname.value
        });

        alert('회원가입 성공');
        router.push('/welcome');
    } catch (e) {
        alert('회원가입 실패');
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/signup-view.css"></style>
