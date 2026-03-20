<template>
    <div id="wrap">
        <AppHeader :isProfile="isProfile" />
        <main :class="{ 'no-profile': !isProfile, 'player-page': isPlayerPage, 'scroll-lock': store.isLoading }">
            <div v-show="!store.isLoading" class="wrap">
                <router-view />
            </div>
            <div v-if="store.isLoading" class="loading-wrap">
                <DotLottieVue class="loading-lottie" autoplay loop :data="loadingDotsData" />
            </div>
        </main>

        <AppFooter v-if="!isPlayerPage" />
    </div>
</template>

<script>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { useIsLoadingStore } from '@/store/api_loading';
import loadingDots from '@/assets/lottie/Loading_Dots_Blue.json';
import AppFooter from '@/components/layout/AppFooter.vue';
import AppHeader from '@/components/layout/AppHeader-2.vue';
import { useAuthStore } from '@/store/auth';

export default {
    name: 'MainLayout2',
    data() {
        return {
            loadingDotsData: JSON.stringify(loadingDots),
            store: useIsLoadingStore(),
            authStore: useAuthStore()
        };
    },
    components: {
        DotLottieVue,
        AppHeader,
        AppFooter
    },
    computed: {
        isProfile() {
            return this.$route.matched.some((r) => r.meta?.isProfile === true);
        },
        isPlayerPage() {
            return this.$route.path.startsWith('/main/player/');
        }
    },
    mounted() {
        this.initAuth();
    },
    methods: {
        async initAuth() {
            const loginCheck = localStorage.getItem('login-check');
            if (!loginCheck) {
                this.handleAuthFailure();
                return;
            }
            try {
                await this.authStore.fetchAuthData();
                if (!this.authStore.authData?.user) {
                    throw new Error('유효한 사용자 정보가 없습니다.');
                }
            } catch (e) {
                console.error('로그인이 안되있습니다.', e);
                this.handleAuthFailure();
            }
        },
        handleAuthFailure() {
            this.authStore.clearAuthState();
            localStorage.removeItem('login-check');
            alert('로그인을 해주세요');
            this.$router.replace('/');
        }
    }
};
</script>

<style scoped>
.wrap {
    height: 100%;
}
#wrap {
    padding: 0;
}
#wrap main {
    position: relative;
    height: calc(100vh - var(--main-offset, 136px));
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: none;
}
#wrap main.no-profile {
    position: relative;
    height: calc(100vh - var(--main-no-profile-offset, 83px));
}
#wrap main.no-profile.player-page {
    top: 0;
    height: 100vh;
    transform: none;
    overflow: visible;
}
#wrap main.scroll-lock {
    overflow: hidden;
}
.loading-wrap {
    position: sticky;
    inset: 0;
    z-index: 19;
    background: rgba(255, 255, 255, 0.7);
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.loading-lottie {
    width: 100%;
    height: 100%;
}

:global(body) {
    --main-offset: 166px;
    --main-no-profile-offset: 83px;
}

:global(body.has-mini-player) {
    --main-offset: 249px;
    --main-no-profile-offset: 163px;
}
</style>
