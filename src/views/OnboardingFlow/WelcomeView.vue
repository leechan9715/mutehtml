<template>
    <main>
        <div class="container">
            <div class="row">
                <Logo />
                <div class="col-1">
                    <h2 class="font-24 fw-800 welcome">WELCOME!</h2>
                </div>
                <div class="col-1">
                    <p class="text-center font-16 fw-400 welcome-des">
                        환영합니다, 00님!<br />
                        뮤트는 사용자의 취향을 분석하고<br />
                        그에 맞게 환경을 설계합니다.<br />
                        보다 몰입하며 음악을 즐겨보세요.
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import Logo from '@/components/ui/Logo.vue';

export default {
    name: 'WelcomeView',

    components: {
        Logo
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/welcome-view.css"></style>
