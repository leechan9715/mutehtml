<template>
    <section id="splash">
        <div class="container">
            <div class="logo-1" :class="{ 'is-load': isLoad }">
                <img :src="logo_1" alt="Logo_1" />
            </div>
            <div class="logo-2" :class="{ 'is-load': isLoad }">
                <div class="row">
                    <Logo :class="{ 'is-load': isLoad }" />
                    <img class="logo-mute-img" :class="{ 'is-load': isLoad }" :src="logo_1" alt="Logo_1" />
                    <p class="tagline" :class="{ 'is-load': isLoad }">나만의 고요한 가상 공간</p>
                    <form action="#" method="post" name="login-form" class="login-form" :class="{ 'is-load': isLoad }">
                        <BaseInput
                            :showcheck="false"
                            icon="mail"
                            title="이메일"
                            id="login-id"
                            name="id"
                            type="text"
                            placeholder="이메일을 입력하세요"
                            v-model="email"
                        />
                        <BaseInput
                            :showcheck="false"
                            icon="lock"
                            title="비밀번호"
                            id="login-pass"
                            name="pass"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            v-model="password"
                        />
                        <div class="auth-links">
                            <a href="#">이메일찾기</a>
                            <a href="#">비밀번호찾기</a>
                        </div>
                        <BaseButton label="로그인" variant="login" type="submit" />
                        <router-link to="/signup">
                            <BaseButton label="회원가입" variant="signup" />
                        </router-link>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import logo1 from '@/assets/images/common/logo.png';
import Logo from '@/components/ui/Logo.vue';
import AuthHeader from '@/components/layout/AuthHeader.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';

export default {
    name: 'SplashView',
    components: {
        Logo,
        AuthHeader,
        BaseButton,
        BaseInput
    },
    data() {
        return {
            isLoad: false,
            logo_1: logo1,

            /* 로그인 */
            email: '',
            password: ''
        };
    },
    mounted() {
        requestAnimationFrame(() => {
            this.isLoad = true;
        });
    },
    /* 로그인 */
    methods: {
        async handleLogin() {
            // 간단 검증
            const email = this.email.trim();
            const password = this.password.trim();

            if (!email) return alert('이메일을 입력하세요.');
            if (!password) return alert('비밀번호를 입력하세요.');

            try {
                // ✅ Vuex 액션 호출 (auth/login 만들어야 함)
                await this.$store.dispatch('auth/login', { username: email, password });

                // ✅ 로그인 성공 후 이동
                this.$router.push('/welcome');
            } catch (e) {
                const msg = e?.response?.data?.message || e?.response?.data?.error || `로그인 실패 `;
                alert(msg);
            }
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/splash-view.css"></style>
