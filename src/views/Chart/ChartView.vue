<template>
    <AppHeader :isProfile="isProfile" />
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
                        width="50"
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
                        width="50"
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
                        width="50"
                    />
                    <span>나만</span>
                </label>
            </div>
        </div>

        <div class="row time-select">
            <div class="col-4">
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
                <img src="@/assets/images/chart/golden.png" alt="golden" />
                <div class="cir-type">
                    <p>BEST</p>
                    <p>SONG</p>
                </div>
            </div>
            <div class="album-info">
                <p>Golden</p>
                <p>HUNTR/X</p>
            </div>
        </div>

        <div class="row chart-list">
            <div class="col-2">
                <p>Top 100</p>
                <a href="#">
                    <span>전체듣기</span>
                    <img src="@/assets/images/icon/right-arrow.png" width="24" alt="" />
                </a>
            </div>
        </div>
        <ChartList></ChartList>
    </section>
    <AppFooter></AppFooter>
</template>

<script>
import AppFooter from '@/components/layout/AppFooter.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import ChartList from '@/components/layout/ChartListItem.vue';

export default {
    name: 'ChartView',
    components: {
        ChartList,
        AppHeader,
        AppFooter
    },
    data() {
        return {
            selectedType: 'country'
        };
    },
    computed: {
        isProfile() {
            return this.$route.matched.some((r) => r.meta?.isProfile === true);
        }
    }
};
</script>
<style scoped src="@/assets/styles/pages/chart.css"></style>
