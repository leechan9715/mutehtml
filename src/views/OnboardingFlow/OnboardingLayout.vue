<template>
    <div id="wrap">
        <AuthHeader />
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
</style>
