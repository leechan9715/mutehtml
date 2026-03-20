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

                <router-link to="/main/chart">
                    <img src="@/assets/images/icon/right-arrow.png" width="30" alt="right-arrow" />
                </router-link>
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
                    :preview-url="list.previewUrl"
                    :played-at="list.playedAt"
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
                    :preview-url="list.previewUrl"
                    :played-at="list.playedAt"
                />
            </div>

            <!-- 나만 -->
            <div class="chart mine-chart" v-show="activeTab === 'mine'">
                <LibraryItem v-for="item in mineLibraryItems" :key="item.id" :item="item" />
            </div>
        </div>
    </section>
</template>

<script>
import { lastfmKoreaTopTracksApi, lastfmGlobalTopTracksApi, searchApi } from '@/api/_music_api';
import LibraryItem from '@/components/layout/LibraryItem.vue';
import MainListItem from '@/components/layout/MainListItem.vue';
import { useIsLoadingStore } from '@/store/api_loading';
import { useMusicImageStore } from '@/store/music';
import { getLibraryItems } from '@/utils/libraryStorage';
export default {
    name: 'HotChartSection',
    components: {
        MainListItem,
        LibraryItem
    },
    data() {
        return {
            store: useIsLoadingStore(),
            musicImageStore: useMusicImageStore(),
            activeTab: 'korea',
            keywords: ['kpop', 'POP'],
            kpop: [],
            global: [],
            libraryItems: []
        };
    },
    computed: {
        mineLibraryItems() {
            return (this.libraryItems || []).slice(0, 4);
        }
    },
    async mounted() {
        this.initLibrary();
        window.addEventListener('library-items-updated', this.onLibraryItemsUpdated);
        this.store.setLoading(true);
        try {
            await Promise.all([this.getKpopResults(), this.getGlobalResults()]);
        } finally {
            this.store.setLoading(false);
            console.log('메인섹션5', this.store.isLoading);
        }
    },
    beforeUnmount() {
        window.removeEventListener('library-items-updated', this.onLibraryItemsUpdated);
    },
    methods: {
        initLibrary() {
            this.libraryItems = getLibraryItems();
        },
        onLibraryItemsUpdated(event) {
            if (event?.detail && Array.isArray(event.detail)) {
                this.libraryItems = event.detail;
                return;
            }
            this.libraryItems = getLibraryItems();
        },
        upgradeArtwork600(url = '') {
            return this.musicImageStore.upgradeArtwork(url, 600);
        },
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
                selectedTracks.map(async (track, index) => {
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
                            artworkUrl100: this.upgradeArtwork600(hit?.artworkUrl100 || ''),
                            previewUrl: hit?.previewUrl || '',
                            playedAt: Date.now() + index
                        };
                    } catch (itunesError) {
                        console.error('itunes enrich error:', itunesError);
                        return {
                            name: title,
                            artistName: singer,
                            artworkUrl100: '',
                            previewUrl: '',
                            playedAt: Date.now() + index
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
    }
};
</script>

<style scoped src="../../assets/styles/pages/main-css/sec-05.css"></style>
