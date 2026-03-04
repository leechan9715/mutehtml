<template>
    <main>
        <form action="#" method="post" name="artist-form" class="container">
            <div class="row artist-select-header">
                <div class="col-1">
                    <h2 class="text-center fw-semibold">
                        좋아하는 가수를 <br />
                        <span class="font-48 color-primary-3"> {{ remainingCount }} </span>명이상 정해주세요.
                    </h2>
                </div>

                <div class="col-1 artist-search-input">
                    <div class="login-form-field">
                        <label class="login-form-label" for="login-id">
                            <span class="hidden">검색창</span>
                            <span class="material-symbols-outlined font-19 color-primary-3">artist</span>
                        </label>

                        <input
                            class="input"
                            id="login-id"
                            name="search"
                            type="text"
                            placeholder="가수 이름을 입력해주세요."
                        />

                        <button type="button" class="name-check">
                            <span class="material-symbols-outlined font-19 color-primary-6">search</span>
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
                    v-model="selectedArtists"
                />
            </div>

            <div class="bottom">
                <div class="button-bg"></div>

                <!-- ✅ 3개 이상 선택 시 active -->
                <router-link to="/signup-info">
                    <button
                        type="button"
                        class="login-btn"
                        :class="{ active: selectedArtists.length >= 3 }"
                        :disabled="selectedArtists.length < 3"
                        @click="testButton"
                    >
                        넘어가기
                    </button>
                </router-link>
            </div>
        </form>
    </main>
</template>

<script>
import ArtistSelectBtn from '@/components/ui/ArtistSelectBtn.vue';
import imgs from '@/assets/images/artist-select/1 1.png';

export default {
    name: 'ArtistSelectView',
    components: { ArtistSelectBtn },
    data() {
        return {
            artists: Array.from({ length: 12 }, () => ({
                name: '아이유',
                img: imgs
            })),
            // ✅ 오타 수정: slelectAtrists -> selectedArtists
            selectedArtists: []
        };
    },
    methods: {
        testButton() {
            // 3개 미만이면 막기 (disabled로도 막지만 안전하게 한 번 더)
            if (this.selectedArtists.length < 3) return;
            alert(this.selectedArtists.join(', '));
        }
    },
    computed: {
        remainingCount() {
            return Math.max(3 - this.selectedArtists.length, 0);
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/artist-select-view.css"></style>

<style scoped>
/* ✅ 기존에 .login-btn .active 로 쓰면 절대 안 먹음 */
/* ✅ 버튼 자체에 active 클래스가 붙는 형태여야 함 */
.login-btn.active {
    background: linear-gradient(180deg, rgba(111, 131, 247, 1) 0%, rgba(56, 82, 232, 1) 100%);
    color: var(--color-white);
}

/* 선택 안 됐을 때(비활성)도 UX를 위해 */
.login-btn:disabled {
    cursor: not-allowed;
}
</style>
