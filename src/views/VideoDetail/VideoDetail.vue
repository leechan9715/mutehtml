<template>aa</template>

<script setup>
import { useRouter } from 'vue-router';
const route = useRouter();
const id = route.params.id;
console.log(id);
</script>

<style></style>
