<template>
    <li class="col-1">
        <span class="material-symbols-outlined bold">{{ icon }}</span>
        <p>{{ label }}</p>
        <label for="disableds" class="hidden">{{ label }}</label>
        <input type="checkbox" id="disableds" disabled />
    </li>
</template>

<script>
export default {
    name: 'TicketSelectList',
    props: {
        icon: { type: String, required: true },
        label: { type: String, required: true }
    }
};
</script>

<style scoped>
.col-1 {
    display: flex;
    gap: 28px;
    width: 100%;
    padding: 0 18px;
}
.col-1 span {
    font-size: var(--font-22);
    color: var(--color-primary-9);
}
.col-1 p {
    font-size: var(--font-16);
    color: var(--color-black);
    font-weight: var(--fw-semibold);
}

.col-1 input[type='checkbox'] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: background 0.2s;
    appearance: none;
    background: url(@/assets/images/icon/check.svg) no-repeat;
    background-size: 100% 100%;
    margin-left: auto;
}
.col-1 input[type='checkbox']:checked {
    background: url(@/assets/images/icon/checked.svg) no-repeat;
}
</style>
