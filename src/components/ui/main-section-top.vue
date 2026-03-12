<template>
    <div class="row" @click="$emit('click')">
        <p class="title">{{ title }}</p>
        <button class="icon-btn" type="button" aria-label="이동" @click.stop="$emit('click')">
            <img src="../../assets/images/icon/right-arrow.png" alt="go" />
        </button>
    </div>
    <slot />
</template>

<script>
export default {
    props: {
        title: { type: String, default: '' }
    },
    emits: ['click']
};
</script>

<style scoped>
.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: clamp(12px, 3vw, 20px);
    padding: 0 10px 0 0;
}

.title {
    font-size: var(--font-22);
    font-weight: var(--fw-semibold);
    line-height: 22px;
    color: var(--color-black);
}

.icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
}

img {
    width: 20px;
    height: auto;
}
</style>
