<template>
    <div class="row">
        <p class="title">{{ title }}</p>
        <button v-if="showArrow" class="icon-btn" type="button" aria-label="이동" @click="handleClick">
            <img src="../../assets/images/icon/right-arrow.png" alt="go" />
        </button>
    </div>
    <slot />
</template>

<script>
export default {
    props: {
        title: { type: String, default: '' },
        showArrow: {
            type: Boolean,
            default: false
        }
    },
    emits: ['click'],
    methods: {
        handleClick() {
            this.$emit('click');
        }
    }
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
