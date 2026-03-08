<template>
    <section class="container" id="nhj">
        <div class="row content1">
            <div class="col-3 hot-chart">
                <p>인기차트</p>

                <div class="tab-group">
                    <input type="radio" id="korea" name="tab" value="korea" v-model="activeTab" />
                    <label for="korea">국내</label>
                    <input type="radio" id="global" name="tab" value="global" v-model="activeTab" />
                    <label for="global">해외</label>
                    <input type="radio" id="mine" name="tab" value="mine" v-model="activeTab" />
                    <label for="mine">나만</label>
                </div>

                <a href="#">
                    <img src="@/assets/images/icon/right-arrow.png" width="30" alt="right-arrow" />
                </a>
            </div>
        </div>

        <div class="row content2">
            <!-- 국내 -->
            <div class="chart korea-chart" v-show="activeTab === 'korea'">
                <MainListItem
                    v-for="(list, index) in kpop"
                    :key="index"
                    :img="list.artworkUrl100"
                    :title="list.name"
                    :singer="list.artistName"
                />
            </div>

            <!-- 해외 -->
            <div class="chart global-chart" v-show="activeTab === 'global'">
                <MainListItem
                    v-for="(list, index) in global"
                    :key="index"
                    :img="list.artworkUrl100"
                    :title="list.name"
                    :singer="list.artistName"
                />
            </div>

            <!-- 나만 -->
            <div class="chart mine-chart" v-show="activeTab === 'mine'">
                <MainListItem />
            </div>
        </div>

        <div class="row content3">
            <img src="@/assets/images/main/muteAd/mutead.png" alt="advertise" />
        </div>
    </section>
</template>

<script>
import MainListItem from '@/components/layout/MainListItem.vue';
import { $api } from '@/mixins/mixins';
export default {
    name: 'HotChartSection',
    components: {
        MainListItem
    },
    data() {
        return {
            activeTab: 'korea',
            keywords: ['kpop', 'POP'],
            kpop: [],
            global: []
        };
    },
    methods: {
        async getKpopResults() {
            try {
                const results = await $api(`${process.env.VUE_APP_BASE_DOTHOME_URL}/api/music/kpop_ranking.php`, 'GET');
                this.kpop = results?.feed?.results?.slice(0, 4) || [];
                console.log(this.kpop);
            } catch (error) {
                console.error('getKpopResults error:', error);
                this.kpop = [];
            }
        },
        async getGlobalResults() {
            try {
                const results = await $api(
                    `${process.env.VUE_APP_BASE_DOTHOME_URL}/api/music/global_ranking.php`,
                    'GET'
                );
                this.global = results?.feed?.results?.slice(0, 4) || [];
            } catch (error) {
                console.error('getKpopResults error:', error);
                this.global = [];
            }
        }
    },
    mounted() {
        this.getKpopResults();
        this.getGlobalResults();
    }
};
</script>

<style scoped src="../../assets/styles/pages/main-css/sec-05.css"></style>
