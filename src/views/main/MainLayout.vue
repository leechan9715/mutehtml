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
import AppHeader from '@/components/layout/AppHeader.vue';

export default {
    name: 'MainLayout',
    components: {
        AppHeader,
        AppFooter
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
    height: calc(100vh - 130px);
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: none;
}
</style>
