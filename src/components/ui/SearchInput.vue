<template>
    <div class="container">
        <div class="row">
            <div class="col-1">
                <input type="text" placeholder="가수 · 노래제목 · 가사를 적어주세요" />
                <span class="material-symbols-outlined bold"> search </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchInput'
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
