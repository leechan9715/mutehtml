<template>
    <MainSec01 />
    <MainSec02 />
    <MainSec03 />
    <MainSec04 />
    <MainSec05 />
    <MainSec06 />
    <MainSec07 />
</template>

<script>
import MainSec01 from '@/views/main/MainSec01.vue';
import MainSec02 from '@/views/main/MainSec02.vue';
import MainSec03 from '@/views/main/MainSec03.vue';
import MainSec04 from '@/views/main/MainSec04.vue';
import MainSec05 from '@/views/main/MainSec05.vue';
import MainSec06 from '@/views/main/MainSec06.vue';
import MainSec07 from '@/views/main/MainSec07.vue';

export default {
    name: 'MainView',
    components: {
        MainSec01,
        MainSec02,
        MainSec03,
        MainSec04,
        MainSec05,
        MainSec06,
        MainSec07
    }
};
</script>

<style scoped src="@/assets/styles/pages/main-css/sec-01.css"></style>
