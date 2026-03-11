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
            <MainListItem
                v-for="(list, index) in this.results"
                @click.prevent="play(list.trackName, list.artistName)"
                :key="index"
                :title="list.trackName"
                :singer="list.artistName"
                :img="list.artworkUrl100"
            />
        </div>
    </section>
</template>

<script>
import MainListItem from '@/components/layout/MainListItem.vue';
import { searchApi } from '@/api/_music_api';

export default {
    name: 'search-result',
    components: { MainListItem },
    data() {
        return {
            term: '',
            results: [],
            searchText: ''
        };
    },
    methods: {
        async getSearchResults() {
            // 현재 주소의 query 값 중 term을 가져옴
            // 예: /main/search-result?term=아이유
            this.term = this.$route.query.term || '';

            // iTunes 검색 API 호출
            const result = await searchApi({
                term: this.term,
                country: 'KR',
                media: 'music',
                entity: 'song',
                limit: 12
            });
            this.results = result?.data?.results;
        },
        // 검색 결과 페이지에서 다시 검색했을 때 실행되는 함수
        handleSearch() {
            console.log(this.searchText);
            this.$router.push({
                path: '/main/search-result',
                query: { term: this.searchText }
            });
        },
        // 사용자가 클릭한 곡 제목(trackName)을 받아서
        // 플레이어 페이지로 이동시키는 함수
        async play(trackName, artistName) {
            const keyword = `${trackName}${artistName}`.trim();
            this.$router.push({
                // 이동할 주소
                // 현재는 /main/player/:id 로 되어 있는데
                // :id 를 실제 값으로 바꾼 게 아니라 문자열 그대로 넣은 상태
                path: '/main/player/:id',

                // query는 URL의 쿼리스트링으로 전달됨
                // 예: ?term=Blueming
                query: {
                    term: keyword
                }
            });
        }
    },
    mounted() {
        this.getSearchResults();
    },
    // 라우터의 쿼리값의 term이 변경되면 결과값출력 함수 재실행
    watch: {
        '$route.query.term'() {
            this.getSearchResults();
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/search-css/search-result.css"></style>
