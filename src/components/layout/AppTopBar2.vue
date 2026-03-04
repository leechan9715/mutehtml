<template>
    <div class="row">
        <div class="col-3">
            <span class="material-symbols-outlined font-26 bold color-primary-3"> arrow_back </span>
        </div>
        <div class="col-3" style="margin: 0 auto">
            <h2 class="fw-semibold font-24 text-center">{{ title }}</h2>
        </div>
        <div class="col-3" style="visibility: hidden">
            <span class="material-symbols-outlined font-26 bold color-primary-3"> arrow_back </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppTopBar2',
    props: {
        title: { type: String, required: true }
    }
};
</script>

<style scoped>
.row:nth-of-type(1) {
    margin-bottom: 40px;
    align-items: center;
}
</style>
