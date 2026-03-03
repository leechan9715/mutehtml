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
    padding: 19px 0;
    border-radius: 30px;
    border: 2px solid #bbd1ff;
    box-shadow: 0px 2px 4px 0px rgba(218, 229, 255, 1);
    font-size: var(--font-22);
    font-weight: bold;
}
.btn-active {
    background: linear-gradient(180deg, rgba(111, 131, 247, 1) 0%, rgba(74, 99, 248, 1) 100%);
    color: #ffffff;
}
.btn-login {
    color: var(--color-primary-4);
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(200, 218, 255, 1) 100%),
        linear-gradient(180deg, rgba(111, 131, 247, 1) 0%, rgba(56, 82, 232, 1) 100%);
}
.btn-signup {
    background: linear-gradient(0deg, rgba(11, 14, 25, 1) 0%, rgba(29, 46, 109, 1) 100%);
    color: #ffffff;
}
.btn-disable {
    background: var(--color-gray);
    color: #ffffff;
}
</style>
