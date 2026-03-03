<template>
    <main>
        <form action="#" method="post" name="artist-form" class="container">
            <div class="row artist-select-header">
                <div class="col-1">
                    <h2 class="text-center fw-semibold">
                        좋아하는 가수를 <br />
                        <span class="font-48 color-primary-3">3</span>명이상 정해주세요.
                    </h2>
                </div>
                <div class="col-1 artist-search-input">
                    <div class="login-form-field">
                        <label class="login-form-label" for="login-id">
                            <span class="hidden">검색창</span>
                            <span class="material-symbols-outlined font-19 color-primary-3"> artist </span></label
                        >
                        <input
                            class="input"
                            id="login-id"
                            name="search"
                            type="text"
                            placeholder="가수 이름을 입력해주세요."
                        />
                        <button type="button" class="name-check">
                            <span class="material-symbols-outlined font-19 color-primary-6"> search </span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="row g-17">
                <ArtistSelectBtn
                    v-for="(artist, index) in artists"
                    :key="index"
                    :artistImg="artist.img"
                    :artistName="artist.name"
                    :value="index + 1"
                    :artistId="index + 1"
                    v-model="slelectAtrists"
                />
            </div>
            <div class="bottom">
                <div class="button-bg"></div>
                <button @click="testButton" type="button" class="login-btn">넘어가기</button>
            </div>
        </form>
    </main>
</template>

<script>
import ArtistSelectBtn from '@/components/ui/ArtistSelectBtn.vue';
import imgs from '@/assets/images/artist-select/1 1.png';
export default {
    name: 'ArtistSelectView',
    data() {
        return {
            imgs,
            artists: Array.from({ length: 12 }, () => ({
                name: '아이유',
                img: imgs
            })),
            slelectAtrists: []
        };
    },

    components: {
        ArtistSelectBtn
    },
    methods: {
        testButton() {
            alert(this.slelectAtrists);
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/artist-select-view.css"></style>
