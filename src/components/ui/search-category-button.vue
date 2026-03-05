<template>
    <div class="category-container" :style="bgStyle">
        <p>{{ category }}</p>
    </div>
</template>

<script>
export default {
    name: 'SearchCategory',
    props: {
        category: { type: String, default: 'Category' },
        bgImg: { type: String, default: '' }
    },
    computed: {
        bgStyle() {
            if (!this.bgImg) return {};
            return {
                backgroundImage: `url(${this.bgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            };
        }
    }
};
</script>
