<template>
    <section class="container">
        <div class="row">
            <div class="recent-box">
                <p>최근에 추가한 보관함</p>
                <img src="@/assets/images/icon/down-arrow.png" alt="down-button" />
            </div>
            <button>
                <img src="@/assets/images/icon/grid.png" alt="grid-button" />
            </button>
        </div>
        <div class="row">
            <PlayListItem />
        </div>
    </section>
</template>

<script>
import PlayListItem from '@/components/layout/PlayListItem.vue';

export default {
    name: 'Library',
    components: {
        PlayListItem
    }
};
</script>

<style scoped src="@/assets/styles/pages/library.css"></style>
