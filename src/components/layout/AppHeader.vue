<template>
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
import logo from '@/assets/images/common/logo.png';
import test from '@/assets/images/common/test.jpg';
export default {
    name: 'AppHeader',
    mixins: [clockMixin],
    props: {
        isProfile: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    data() {
        return {
            logo,
            test
        };
    }
};
</script>

<style scoped>
header {
    position: relative;
    z-index: 9999;
}
header.container {
    padding: 20px 25px;
    gap: 25px;
    background-color: #fff;
    box-shadow:
        inset 0px -7px 10px var(--color-shadow),
        0px -3px 10px var(--color-shadow);
}

header .row:nth-child(1) {
    justify-content: space-between;
}
header .time {
    font-weight: 900;
}
header .row:nth-child(1) .col-2:nth-child(2) {
    display: flex;
    gap: 5px;
}
</style>
