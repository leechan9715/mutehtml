<template>
    <!-- 시간출력 부분 -->
    <header class="container">
        <div class="row">
            <div class="col-2">
                <p class="time">{{ time }}</p>
            </div>
            <div class="col-2">
                <span class="material-symbols-outlined"> android_cell_4_bar </span>
                <span class="material-symbols-outlined"> wifi </span>
                <span class="material-symbols-outlined"> battery_android_frame_full </span>
            </div>
        </div>
    </header>
</template>

<script>
import clockMixin from '@/mixins/clockMixin';

export default {
    name: 'AuthHeader',
    mixins: [clockMixin]
};
</script>

<style scoped>
header {
    position: fixed;
    z-index: 9999;
    color: var(--color-black);
}
.row {
    background-color: rgba(0, 0, 0, 0);
}

.row {
    justify-content: space-between;
    padding: 13px 0;
}
.row .col-2:nth-child(2) {
    display: flex;
    gap: 7px;
}
</style>
