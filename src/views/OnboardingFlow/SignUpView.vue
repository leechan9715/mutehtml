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
                    <BaseButton class="login-btn" label="가입하기" variant="active" />
                </div>
                <div class="col-1 social-login">
                    <p class="text-center">소셜 계정으로 가입하기</p>
                </div>
            </form>
            <div class="row g-24 social-login-icon">
                <img :src="facebook" alt="facebook" />
                <img :src="google" alt="google" />
                <img :src="apple" alt="apple" />
            </div>
        </div>
    </main>
</template>

<script>
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import facebook from '@/assets/images/signup/facebook.png';
import google from '@/assets/images/signup/google.png';
import apple from '@/assets/images/signup/apple.png';
export default {
    name: 'SignUp',
    components: {
        BaseInput,
        BaseButton
    },
    data() {
        return {
            facebook,
            google,
            apple
        };
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/signup-view.css"></style>
