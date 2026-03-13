<template>
    <section class="container">
        <div class="row boundery-select">
            <div class="col-3">
                <label class="column">
                    <input class="icon-radio" type="radio" value="country" v-model="selectedType" name="select-type" />
                    <img
                        :src="
                            selectedType === 'country'
                                ? require('@/assets/images/icon/country_checked.png')
                                : require('@/assets/images/icon/country.png')
                        "
                    />
                    <span>국내</span>
                </label>

                <label class="column">
                    <input class="icon-radio" type="radio" value="global" v-model="selectedType" name="select-type" />
                    <img
                        :src="
                            selectedType === 'global'
                                ? require('@/assets/images/icon/globe_checked.png')
                                : require('@/assets/images/icon/globe.png')
                        "
                    />
                    <span>해외</span>
                </label>

                <label class="column">
                    <input class="icon-radio" type="radio" value="heart" v-model="selectedType" name="select-type" />
                    <img
                        :src="
                            selectedType === 'heart'
                                ? require('@/assets/images/icon/heart_checked.png')
                                : require('@/assets/images/icon/heart.png')
                        "
                    />
                    <span>나만</span>
                </label>
            </div>
        </div>

        <div class="row time-select">
            <div class="col-4 color-black">
                <input type="radio" id="daily" name="period" checked />
                <label for="daily">일간</label>

                <input type="radio" id="weekly" name="period" />
                <label for="weekly">주간</label>

                <input type="radio" id="monthly" name="period" />
                <label for="monthly">월간</label>

                <input type="radio" id="yearly" name="period" />
                <label for="yearly">연간</label>
            </div>
        </div>

        <div class="row top-one">
            <div class="col-1 circlebox">
                <div class="circle"></div>
                <img :src="activeTopOne?.artworkUrl100 || topOneFallbackCover" alt="top-one-cover" />
                <div class="cir-type">
                    <p>BEST</p>
                    <p>SONG</p>
                </div>
            </div>
            <div class="album-info">
                <p>{{ activeTopOne?.name || 'Top 1' }}</p>
                <p>{{ activeTopOne?.artistName || '-' }}</p>
            </div>
        </div>

        <div class="row chart-list">
            <div class="col-2 color-black">
                <p>Top {{ chartLimit }}</p>
                <a href="#" @click.prevent="playAllFromChart">
                    <span>전체듣기</span>
                    <img src="@/assets/images/icon/right-arrow.png" width="24" alt="" />
                </a>
            </div>
        </div>
        <template v-if="selectedType !== 'heart'">
            <ChartListItem
                v-for="(item, index) in activeTopList"
                :key="`${selectedType}-${item.rank || index}`"
                :index="index"
                :rank="item.rank"
                :img="item.artworkUrl100 || fallbackCover"
                :title="item.name"
                :singer="item.artistName"
                trend="up"
                @click.prevent="playFromChart(item)"
            />
        </template>
    </section>
</template>

<script>
import ChartListItem from '@/components/layout/ChartListItem.vue';
import fallbackCover from '@/assets/images/main/1.png';
import goldenCover from '@/assets/images/chart/golden.png';
import { lastfmKoreaTopTracksApi, lastfmGlobalTopTracksApi, searchApi } from '@/api/_music_api';
import { useIsLoadingStore } from '@/store/api_loading';

const PLAYER_STATE_KEY = 'mute-player-state';
const ITUNES_CACHE_KEY = 'mute-chart-itunes-cache-v1';

export default {
    name: 'ChartView',
    components: {
        ChartListItem
    },
    data() {
        return {
            selectedType: 'country',
            fallbackCover,
            goldenCover,
            chartLimit: 20,
            maxItunesRequestsPerLoad: 8,
            itunesBlocked: false,
            itunesCache: {},
            countryTopOne: null,
            countryTopList: [],
            globalTopOne: null,
            globalTopList: [],
            store: useIsLoadingStore()
        };
    },
    computed: {
        activeTopOne() {
            return this.selectedType === 'global' ? this.globalTopOne : this.countryTopOne;
        },
        topOneFallbackCover() {
            return this.selectedType === 'global' ? this.fallbackCover : this.goldenCover;
        },
        activeTopList() {
            const fullList = this.selectedType === 'global' ? this.globalTopList : this.countryTopList;
            return fullList.slice(0, this.chartLimit - 1);
        },
        activeChartTracks() {
            const topOne = this.activeTopOne ? [this.activeTopOne] : [];
            return [...topOne, ...this.activeTopList];
        }
    },
    watch: {
        selectedType() {
            this.ensureChartData();
        }
    },
    async mounted() {
        this.store.setLoading(true);
        try {
            await Promise.all([this.hydrateItunesCache(), this.ensureChartData()]);
        } finally {
            this.store.setLoading(false);
        }
    },
    methods: {
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },

        buildItunesCacheKey(country, artistName, title) {
            return `${country}::${(artistName || '').trim().toLowerCase()}::${(title || '').trim().toLowerCase()}`;
        },

        hydrateItunesCache() {
            try {
                const raw = sessionStorage.getItem(ITUNES_CACHE_KEY);
                this.itunesCache = raw ? JSON.parse(raw) : {};
            } catch {
                this.itunesCache = {};
            }
        },

        persistItunesCache() {
            try {
                sessionStorage.setItem(ITUNES_CACHE_KEY, JSON.stringify(this.itunesCache));
            } catch {
                // ignore storage quota errors
            }
        },

        getLastfmImage(track) {
            const large = track?.image?.find?.((img) => img?.size === 'large')?.['#text'] || '';
            const medium = track?.image?.find?.((img) => img?.size === 'medium')?.['#text'] || '';
            const candidate = large || medium;

            // Last.fm default placeholder image should be treated as "no image"
            if (candidate.includes('2a96cbd8b46e442fc41c2b86b821562f.png')) return '';
            return candidate;
        },

        async ensureChartData() {
            if (this.selectedType === 'heart') return;

            if (this.selectedType === 'country' && this.countryTopList.length) return;
            if (this.selectedType === 'global' && this.globalTopList.length) return;

            if (this.selectedType === 'country') {
                const { topOne, topList } = await this.fetchTop100(lastfmKoreaTopTracksApi, 'KR');
                this.countryTopOne = topOne;
                this.countryTopList = topList;
                return;
            }

            const { topOne, topList } = await this.fetchTop100(lastfmGlobalTopTracksApi, 'KR');
            this.globalTopOne = topOne;
            this.globalTopList = topList;
        },

        getLastfmArtistName(track) {
            if (!track?.artist) return '';
            if (typeof track.artist === 'string') return track.artist;
            return track.artist?.name || '';
        },

        async fetchTop100(lastfmApi, country) {
            try {
                const { data } = await lastfmApi({ page: 1, limit: this.chartLimit });
                const tracks = (data?.tracks?.track || []).slice().sort((a, b) => {
                    const rankA = Number(a?.['@attr']?.rank ?? Number.MAX_SAFE_INTEGER);
                    const rankB = Number(b?.['@attr']?.rank ?? Number.MAX_SAFE_INTEGER);
                    return rankA - rankB;
                });

                const enriched = await this.enrichWithItunes(tracks, country);
                const [topOne, ...rest] = enriched;
                return { topOne: topOne || null, topList: rest };
            } catch (error) {
                console.error('fetchTop100 error:', error);
                return { topOne: null, topList: [] };
            }
        },

        async enrichWithItunes(tracks, country) {
            const result = [];
            let isBlocked = this.itunesBlocked;
            let failCount = 0;
            let requestCount = 0;

            for (const track of tracks) {
                const title = track?.name || '';
                const artistName = this.getLastfmArtistName(track);
                const rank = Number(track?.['@attr']?.rank || 0);
                const lastfmImage = this.getLastfmImage(track);
                const cacheKey = this.buildItunesCacheKey(country, artistName, title);
                const cached = this.itunesCache[cacheKey];

                if (cached) {
                    result.push({
                        rank,
                        name: cached.name || title,
                        artistName: cached.artistName || artistName,
                        artworkUrl100: cached.artworkUrl100 || lastfmImage,
                        previewUrl: cached.previewUrl || ''
                    });
                    continue;
                }

                if (isBlocked || requestCount >= this.maxItunesRequestsPerLoad) {
                    result.push({
                        rank,
                        name: title,
                        artistName,
                        artworkUrl100: lastfmImage,
                        previewUrl: ''
                    });
                    continue;
                }

                try {
                    requestCount += 1;
                    const { data: itunesData } = await searchApi({
                        term: `${artistName} ${title}`.trim(),
                        country,
                        media: 'music',
                        entity: 'song',
                        limit: 1
                    });
                    const hit = itunesData?.results?.[0];
                    failCount = 0;

                    this.itunesCache[cacheKey] = {
                        name: hit?.trackName || title,
                        artistName: hit?.artistName || artistName,
                        artworkUrl100: hit?.artworkUrl100 || '',
                        previewUrl: hit?.previewUrl || ''
                    };

                    result.push({
                        rank,
                        name: hit?.trackName || title,
                        artistName: hit?.artistName || artistName,
                        artworkUrl100: hit?.artworkUrl100 || lastfmImage,
                        previewUrl: hit?.previewUrl || ''
                    });
                } catch (error) {
                    const status = error?.response?.status;
                    if (status === 403 || status === 429) {
                        failCount += 1;
                    } else {
                        failCount = 0;
                    }

                    // Do not block immediately; only block after repeated failures
                    if (failCount >= 6) {
                        isBlocked = true;
                        this.itunesBlocked = true;
                    }
                    result.push({
                        rank,
                        name: title,
                        artistName,
                        artworkUrl100: lastfmImage,
                        previewUrl: ''
                    });
                }

                // Small pacing delay to reduce iTunes proxy rate-limit bursts
                if (!isBlocked) await this.sleep(80);
            }

            this.persistItunesCache();
            return result;
        },

        playFromChart(track) {
            this.playChartTracks(track);
        },

        playAllFromChart() {
            this.playChartTracks();
        },

        playChartTracks(selectedTrack = null) {
            const sourceTracks = this.activeChartTracks;
            const tracks = sourceTracks
                .map((item) => ({
                    previewUrl: item?.previewUrl || '',
                    artistName: item?.artistName || '',
                    trackName: item?.name || '',
                    albumCover: item?.artworkUrl100 || ''
                }))
                .filter((item) => item.trackName);

            if (!tracks.length) return;

            let currentIndex = 0;
            if (selectedTrack) {
                const clickedRank = Number(selectedTrack?.rank || 0);
                currentIndex = tracks.findIndex((item, index) => {
                    const source = sourceTracks[index];
                    return Number(source?.rank || 0) === clickedRank;
                });

                if (currentIndex < 0) {
                    currentIndex = tracks.findIndex(
                        (item) =>
                            item.trackName === (selectedTrack?.name || '') &&
                            item.artistName === (selectedTrack?.artistName || '')
                    );
                }
            }

            if (currentIndex < 0) currentIndex = 0;
            if (!tracks[currentIndex]?.previewUrl) {
                const playableIndex = tracks.findIndex((item) => !!item.previewUrl);
                if (playableIndex >= 0) currentIndex = playableIndex;
            }

            const currentTrack = tracks[currentIndex] || tracks[0];
            const payload = {
                tracks,
                currentIndex,
                songName: currentTrack?.trackName || '',
                singerName: currentTrack?.artistName || '',
                albumCover: currentTrack?.albumCover || '',
                totalDuration: 0,
                isPlaying: true,
                miniVisible: false,
                playerPath: `/main/player/${currentIndex}`,
                updatedAt: Date.now()
            };

            localStorage.setItem(PLAYER_STATE_KEY, JSON.stringify(payload));
            window.dispatchEvent(new CustomEvent('mute-player-state-updated', { detail: payload }));
            this.$router.push({ path: `/main/player/${currentIndex}` });
        }
    }
};
</script>
<style scoped src="@/assets/styles/pages/chart.css"></style>
