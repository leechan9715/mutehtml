<template>
    <section class="container" id="section1">
        <div class="row">
            <div class="col-1">
                <input type="text" placeholder="가수 · 노래제목 · 가사를 적어주세요" />
                <span class="material-symbols-outlined bold"> search </span>
            </div>
        </div>
        <div class="row">
            <MainListItem />
        </div>
    </section>
</template>

<script>
import MainListItem from '@/components/layout/MainListItem.vue';

export default {
    components: { MainListItem }
};
</script>

<style scoped src="@/assets/styles/pages/search-css/search-result.css"></style>
