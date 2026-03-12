<template>
    <div id="wrap">
        <AppHeader :isProfile="isProfile" />
        <main :class="{ 'no-profile': !isProfile, 'player-page': isPlayerPage }">
            <router-view />
        </main>
        <AppFooter v-if="!isPlayerPage" />
    </div>
</template>

<script>
import AppFooter from '@/components/layout/AppFooter.vue';
import AppHeader from '@/components/layout/AppHeader-2.vue';
import playlistInfo from '@/components/ui/playlist-info.vue';
import VibeSelectBtn from '@/components/ui/VibeSelectBtn.vue';

export default {
    name: 'MainLayout2',
    components: {
        AppHeader,
        AppFooter,
        playlistInfo,
        VibeSelectBtn
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
        // this.loginCheck();
    },

    methods: {
        loginCheck() {
            const auth_check = localStorage.getItem('login-check');
            if (!auth_check) {
                alert('로그인을 해주세요');
                this.$router.push('/');
            }
        }
    }
};
</script>

<style scoped>
#wrap {
    padding: 0;
}
#wrap main {
    height: calc(100vh - 200px);
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    transform: translateY(-30px);
}
#wrap main.no-profile {
    position: relative;
    top: 30px;
    height: calc(100vh - 136px);
}
#wrap main.no-profile.player-page {
    top: 0;
    height: 100vh;
    transform: none;
    overflow: visible;
}
</style>
