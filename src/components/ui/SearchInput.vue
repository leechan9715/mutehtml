<template>
    <div class="container">
        <div class="row">
            <div class="col-1">
                <input type="text" :placeholder="placeholder" />
                <span class="material-symbols-outlined bold"> search </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchInput',
    props: {
        placeholder: { type: String, default: '' }
    }
};
</script>

<style scoped>
.row {
    border: 1px solid var(--color-primary-5);
    border-radius: 10px;
    background-color: #ffffff;
    padding: 18px 16px;
}

.row .col-1 {
    background-color: #ffffff;
    display: flex;
}
.row .col-1 input {
    font-size: var(--font-14);
    font-weight: var(--fw-medium);
    background-color: #ffffff;
    width: 100%;
}

.row .col-1 span {
    font-size: var(--font-22);
    color: var(--color-primary-4);
    margin-left: auto;
    cursor: pointer;
}
</style>
