<template>
    <MainSec01 />
    <MainSec02 />
    <MainSec03 />
    <MainSec04 />
</template>

<script>
import MainSec01 from '@/views/main/MainSec01.vue';
import MainSec02 from '@/views/main/MainSec02.vue';
import MainSec03 from '@/views/main/MainSec03.vue';
import MainSec04 from '@/views/main/MainSec04.vue';
export default {
    name: 'MainView',
    components: {
        MainSec01,
        MainSec02,
        MainSec03,
        MainSec04
    }
};
</script>

<style scoped src="@/assets/styles/pages/main-css/sec-01.css"></style>
