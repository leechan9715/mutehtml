<template>
    <main>
        <div class="container">
            <div class="row">
                <Logo />
                <div class="col-1">
                    <h2 class="font-24 fw-800 welcome">WELCOME!</h2>
                </div>
                <div class="col-1">
                    <p class="text-center font-16 fw-400 welcome-des" ref="welcome-des">
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
    data() {
        return {
            welcomeDes: null,
            lines: [],
            lineIndex: 0,
            charIndex: 0,
            typingTimer: null,
            redirectTimer: null
        };
    },
    components: {
        Logo
    },
    mounted() {
        this.welcomeDes = this.$refs['welcome-des'];
        this.lines = this.welcomeDes.innerHTML.split(/<br\b[^>]*>/i);
        this.welcomeDes.innerHTML = '';
        this.lineIndex = 0;
        this.charIndex = 0;
        this.redirectTimer = setTimeout(() => {
            this.$router.push('/artist-select');
        }, 10000); // 5초 후에 회원가입 페이지로 이동
        this.typeLine();
    },
    beforeUnmount() {
        clearTimeout(this.typingTimer);
        clearTimeout(this.redirectTimer);
    },

    methods: {
        typeLine() {
            if (this.lineIndex < this.lines.length) {
                if (this.charIndex < this.lines[this.lineIndex].length) {
                    this.welcomeDes.innerHTML += this.lines[this.lineIndex][this.charIndex];
                    this.charIndex++;
                    this.typingTimer = setTimeout(() => this.typeLine(), 40); // 타이핑 속도 조절
                } else {
                    this.welcomeDes.innerHTML += '<br>';
                    this.lineIndex++;
                    this.charIndex = 0;
                    this.typingTimer = setTimeout(() => this.typeLine(), 200); // 줄 바뀔 때 약간 텀
                }
            }
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/welcome-view.css"></style>
