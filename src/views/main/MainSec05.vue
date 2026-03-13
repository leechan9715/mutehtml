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
                    @click.prevent="playFromChart(list)"
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
                    @click.prevent="playFromChart(list)"
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
    </section>
</template>

<script>
import { lastfmKoreaTopTracksApi, lastfmGlobalTopTracksApi, searchApi } from '@/api/_music_api';
import MainListItem from '@/components/layout/MainListItem.vue';
import { useIsLoadingStore } from '@/store/api_loading';
export default {
    name: 'HotChartSection',
    components: {
        MainListItem
    },
    data() {
        return {
            store: useIsLoadingStore(),
            activeTab: 'korea',
            keywords: ['kpop', 'POP'],
            kpop: [],
            global: []
        };
    },
    methods: {
        playFromChart(track) {
            const title = track?.trackName || track?.name || '';
            const singer = track?.artistName || '';
            const keyword = `${title} ${singer}`.trim();
            if (!keyword) return;

            this.$router.push({
                path: '/main/player/0',
                query: { term: keyword }
            });
        },
        getLastfmArtistName(track) {
            if (!track?.artist) return '';
            if (typeof track.artist === 'string') return track.artist;
            return track.artist?.name || '';
        },
        async buildChartItemsFromLastfm(topTracks = [], country = 'KR') {
            const selectedTracks = topTracks.slice(0, 4);
            return Promise.all(
                selectedTracks.map(async (track) => {
                    const title = track?.name || '';
                    const singer = this.getLastfmArtistName(track);
                    try {
                        const { data: itunesData } = await searchApi({
                            term: `${singer} ${title}`.trim(),
                            country,
                            media: 'music',
                            entity: 'song',
                            limit: 1
                        });
                        const hit = itunesData?.results?.[0];
                        return {
                            name: title,
                            artistName: singer,
                            artworkUrl100: hit?.artworkUrl100 || ''
                        };
                    } catch (itunesError) {
                        console.error('itunes enrich error:', itunesError);
                        return {
                            name: title,
                            artistName: singer,
                            artworkUrl100: ''
                        };
                    }
                })
            );
        },
        async getKpopResults() {
            try {
                const { data } = await lastfmKoreaTopTracksApi();
                const topTracks = data?.tracks?.track || [];
                this.kpop = await this.buildChartItemsFromLastfm(topTracks, 'KR');
            } catch (error) {
                console.error('getKpopResults error:', error);
                this.kpop = [];
            }
        },

        async getGlobalResults() {
            try {
                const { data } = await lastfmGlobalTopTracksApi();
                const topTracks = data?.tracks?.track || [];
                this.global = await this.buildChartItemsFromLastfm(topTracks, 'US');
            } catch (error) {
                console.error('getGlobalResults error:', error);
                this.global = [];
            }
        }
    },
    async mounted() {
        this.store.setLoading(true);
        try {
            await Promise.all([this.getKpopResults(), this.getGlobalResults()]);
        } finally {
            this.store.setLoading(false);
            console.log('메인섹션5', this.store.isLoading);
        }
    }
};
</script>

<style scoped src="../../assets/styles/pages/main-css/sec-05.css"></style>
