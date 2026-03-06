<template>
    <div id="wrap">
        <AppHeader :isProfile="isProfile" />
        <main>
            <router-view />
        </main>
        <AppFooter />
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
        }
    }
};
</script>

<style scoped>
#wrap {
    padding: 0;
}
main {
    height: calc(100vh - 200px);
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    transform: translateY(-30px);
}
</style>
