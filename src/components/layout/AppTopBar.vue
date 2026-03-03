<template>
    <div class="row top-bar">
        <a href="#"><img :src="leftArrow" width="30" alt="back_button" /></a>
        <a href="#">⁝</a>
    </div>
</template>

<script>
import leftArrow from '@/assets/images/icon/left-arrow.png';
export default {
    name: 'AppTopBar.vue',
    data() {
        return {
            leftArrow
        };
    }
};
</script>

<style scoped>
.top-bar {
    height: 40px;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.top-bar a:last-of-type {
    font-size: 30px;
}
</style>
