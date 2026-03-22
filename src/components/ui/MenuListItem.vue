<template>
    <li>
        <router-link :to="link">
            <span class="material-symbols-outlined bold" :class="{ 'is-danger': danger }">{{ icon }}</span>
            <p>{{ title }}</p>
            <img :src="require('@/assets/images/icon/right-arrow.png')" class="arrow" />
        </router-link>
    </li>
</template>

<script>
export default {
    name: 'MenuListItem',
    props: {
        icon: { type: String, default: 'notifications' },
        title: { type: String, required: true },
        link: { type: String, required: true },
        danger: { type: Boolean, default: false }
    }
};
</script>

<style scoped>
.arrow {
    width: 20px;
    margin-left: auto;
}
li {
    padding: 18px 0;
    border-bottom: 1px solid var(--color-primary-5);
}

li a {
    font-size: var(--font-21);
    display: flex;
    align-items: center;
    gap: 31px;
}

li span:first-child {
    text-indent: 5px;
    font-size: var(--font-24);
}
li p {
    text-indent: 5px;
    font-size: var(--font-16);
    font-weight: var(--fw-medium);
}

li span:last-child {
    margin-left: auto;
    text-indent: 5px;
    font-size: var(--font-24);
}
.is-danger {
    color: var(--color-red);
}
</style>
