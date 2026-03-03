<template>
    <div class="row" @click="$emit('click')">
        <h2 class="title">{{ title }}</h2>

        <button class="icon-btn" type="button" aria-label="이동" @click.stop="$emit('click')">
            <span class="material-symbols-outlined">chevron_right</span>
        </button>
    </div>
</template>

<script>
export default {
    props: {
        title: { type: String, default: '요즘 가장 좋아하는 노래' }
    },
    emits: ['click']
};
</script>

<style scoped>
.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
    background-color: white;
}

.title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
}

.icon-btn {
    border: 0;
    background: transparent;
    padding: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.material-symbols-outlined {
    font-size: 18px;
    line-height: 1;
}
</style>
