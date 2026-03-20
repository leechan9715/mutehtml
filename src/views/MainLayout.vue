<template>
    <div id="wrap">
        <AppHeader />
        <main>
            <router-view />
        </main>
        <AppFooter />
    </div>
</template>

<script>
import AppFooter from '@/components/layout/AppFooter.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import playlistInfo from '@/components/ui/playlist-info.vue';
import VibeSelectBtn from '@/components/ui/VibeSelectBtn.vue';

export default {
    name: 'MainLayout',
    components: {
        AppHeader,
        AppFooter,
        playlistInfo,
        VibeSelectBtn
    }
};
</script>

<style scoped>
#wrap {
    padding: 0;
}
main {
    position: relative;
    top: 30px;
    height: calc(100vh - 153px);
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    transform: translateY(-30px);
}
</style>
