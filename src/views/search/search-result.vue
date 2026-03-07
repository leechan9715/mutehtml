<template>
    <section class="container" id="section1">
        <div class="row">
            <form @submit.prevent="handleSearch" class="col-1">
                <input type="text" v-model="searchText" placeholder="가수 · 노래제목 · 가사를 적어주세요" />
                <button type="submit">
                    <span class="material-symbols-outlined bold"> search </span>
                </button>
            </form>
        </div>
        <div class="row">
            <a v-for="(list, index) in this.results" :key="index" href="javascript:void(0)" class="col-2">
                <MainListItem
                    :title="list.collectionCensoredName"
                    :singer="list.artistName"
                    :img="list.artworkUrl100"
                />
            </a>
        </div>
    </section>
</template>

<script>
import MainListItem from '@/components/layout/MainListItem.vue';
import { $api } from '@/mixins/mixins';

export default {
    name: 'search-result',
    components: { MainListItem },
    data() {
        return {
            singer: '',
            results: [],
            searchText: ''
        };
    },
    methods: {
        async getSearchResults() {
            this.singer = this.$route.query.term || '';
            const result = await $api('https://itunes.apple.com/search', 'GET', {
                term: this.singer,
                country: 'KR',
                media: 'music',
                entity: 'album',
                limit: 12
            });
            console.log(result);
            this.results = result.results;
            console.log(this.results);
        },
        handleSearch() {
            console.log(this.searchText);
            this.$router.push({
                path: '/main/search-result',
                query: { term: this.searchText }
            });
        }
    },
    mounted() {
        this.getSearchResults();
    },
    watch: {
        '$route.query.term'() {
            this.getSearchResults();
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/search-css/search-result.css"></style>
