<template>
    <div id="wrap">
        <div class="box">
            <router-view />
        </div>
    </div>
</template>

<script>
import AuthHeader from '@/components/layout/AuthHeader.vue';
export default {
    name: 'OnboardingLayout',
    components: {
        AuthHeader
    }
};
</script>

<style scoped>
.box {
    position: relative;
    top: 50px;
}

#wrap {
    background-image: url(@/assets/images/bg/bg_big.png);
    background-attachment: fixed;
    background-repeat: no-repeat;
}
</style>
