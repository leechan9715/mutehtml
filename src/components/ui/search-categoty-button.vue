<template>
    <div class="category-container" :class="bgClass">
        <div class="category">
            <p>{{ category }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchCategory',
    props: {
        category: { type: String, default: 'Category' },
        bgClass: { type: String, default: '' } // 예: "pop", "kpop", "hip-hop"
    }
};
</script>

<style scoped>
.category-container {
    width: 247px;
    height: 70px;
    border-radius: 20px;
    background-color: wheat; /* 기본값(이미지 없을 때) */
}

.category {
    width: 247px;
    height: 70px;
    overflow: hidden;
    margin: 0 auto;
    padding: 24px 0;
    border-radius: 12px;
    background-color: thistle;
    display: flex;
    justify-content: center;
    align-items: center;
}
.category p {
    color: #fff;
    font-size: var(--font-24);
    font-weight: var(--fw-medium);
}
</style>
