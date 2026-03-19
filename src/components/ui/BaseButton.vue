<template>
    <button :class="`btn ${variantClass}`">{{ label }}</button>
</template>

<script>
export default {
    name: 'BaseButton',
    props: {
        label: { type: String, required: true },
        variant: { type: String, default: 'active' }
    },
    computed: {
        variantClass() {
            return `btn-${this.variant}`;
        }
    }
};
</script>

<style scoped>
.btn {
    width: 100%;
    padding: 14px 16px;
    border-radius: 50px;
    box-shadow: 0px 2px 4px 0px var(--color-shadow);
    font-size: var(--font-20);
    font-weight: bold;
}
.btn-active {
    background: var(--gradient-key);
    color: #ffffff;
}
.btn-login {
    color: var(--color-key);
    background: var(--gradient-light);
    border: 1px solid var(--color-shadow);
}
.btn-signup {
    background: var(--gradient-deep);
    color: #ffffff;
}
.btn-disable {
    background: var(--color-gray);
    color: #ffffff;
}
</style>
