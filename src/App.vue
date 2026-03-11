<template>
    <router-view />
    <MiniPlayer />
</template>

<script>
import MiniPlayer from '@/components/layout/MiniPlayer.vue';

export default {
    name: 'App',
    components: {
        MiniPlayer
    }
};
</script>

<style></style>
