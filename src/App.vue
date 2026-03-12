<template>
    <router-view />
    <MiniPlayer :full-player-open="fullPlayerOpen" @open-player="openFullPlayer" />
    <div v-if="fullPlayerOpen" class="player-overlay-layer">
        <button class="player-backdrop" type="button" aria-label="플레이어 닫기" @click="closeFullPlayer"></button>
        <Player :overlay-mode="true" @close="closeFullPlayer" />
    </div>
</template>

<script>
import MiniPlayer from '@/components/layout/MiniPlayer.vue';
import Player from '@/views/player/player.vue';

export default {
    name: 'App',
    components: {
        MiniPlayer,
        Player
    },
    data() {
        return {
            fullPlayerOpen: false
        };
    },
    watch: {
        fullPlayerOpen(next) {
            this.syncBodyPlayerClass(next);
        }
    },
    mounted() {
        this.syncBodyPlayerClass(this.fullPlayerOpen);
    },
    beforeUnmount() {
        this.syncBodyPlayerClass(false);
    },
    methods: {
        openFullPlayer() {
            this.fullPlayerOpen = true;
        },
        closeFullPlayer() {
            this.fullPlayerOpen = false;
        },
        syncBodyPlayerClass(isOpen) {
            document.body.classList.toggle('full-player-open', !!isOpen);
        }
    }
};
</script>

<style scoped>
.player-overlay-layer {
    position: fixed;
    inset: 0;
    z-index: 10020;
}

.player-backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    background: rgba(0, 0, 0, 0.38);
    cursor: pointer;
}

:global(body.full-player-open header.container) {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
}

:global(body.full-player-open footer.container) {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
}
</style>
