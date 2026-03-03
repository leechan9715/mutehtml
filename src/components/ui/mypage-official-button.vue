<template>
    <li>
        <a href="#">
            <span class="material-symbols-outlined bold">notifications</span>
            <p>알림</p>
            <span class="material-symbols-outlined font-18 thin"> arrow_forward_ios </span>
        </a>
    </li>
</template>

<script>
export default {};
</script>

<style scoped>
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
    text-indent: 20px;
    font-size: var(--font-21);
}
li p {
    text-indent: 20px;
    font-size: var(--font-16);
    font-weight: var(--fw-medium);
}

li span:last-child {
    margin-left: auto;
    text-indent: 20px;
    font-size: var(--font-18);
}
</style>
