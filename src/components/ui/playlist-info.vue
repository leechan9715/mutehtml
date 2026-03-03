<template>
    <div class="round-label">{{ text }}</div>
    <!-- <컴포넌트이름 text="제작자 - 홍길동" /> 이렇게 바꾸기 -->
</template>

<script>
export default {
    name: 'playlist-info',
    props: {
        text: {
            type: String,
            required: true
        }
    }
};
</script>
<style scoped>
.round-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 50px;
    border: 2px solid #bbd1ff;
    border-radius: 9999px;
    background: #fff;
    color: #1f2d4d;
    font-weight: 600;
}
</style>
