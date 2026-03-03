<template>
    <button class="round-label">{{ text }}</button>
</template>

<script>
export default {
    name: 'vibe-select-btn',
    props: {
        text: {
            type: String,
            required: true
        }
    }
};
</script>
<style scoped>
.round-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 25px;
    border: 2px solid #bbd1ff;
    border-radius: 9999px;
    background: #fff;
    color: #1f2d4d;
    font-weight: 600;
    font-size: 18px;
    box-shadow: 0px 2px 4px #dae5ff;
}

.round-label:active {
    background: #6f83f7;
    color: #ffffff;
    border: 2px solid #b0bcff;
    box-shadow: 0px 2px 4px #4153bc;
}
</style>
