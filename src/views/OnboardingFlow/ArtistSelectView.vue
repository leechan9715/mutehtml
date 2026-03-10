<template>
    <main>
        <form action="#" name="artist-form" class="container">
            <div class="row artist-select-header">
                <div class="col-1">
                    <h2 class="text-center fw-semibold color-black">
                        좋아하는 가수를 <br />
                        <span class="font-48 color-key">{{ remainingCount }}</span
                        >명 이상 정해주세요.
                    </h2>
                </div>

                <div class="col-1 artist-search-input">
                    <div class="login-form-field">
                        <label class="login-form-label" for="login-id">
                            <span class="hidden">검색창</span>
                            <span class="material-symbols-outlined font-24 color-key">artist</span>
                        </label>

                        <input
                            class="input"
                            id="login-id"
                            name="search"
                            type="text"
                            placeholder="가수 이름을 입력해주세요."
                            v-model="searchText"
                        />

                        <button type="button" class="name-check" @click="searchArtist">
                            <span class="material-symbols-outlined font-24 color-gray">search</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="row g-17">
                <ArtistSelectBtn
                    v-for="artist in filteredArtists"
                    :key="artist.id"
                    :artistImg="artist.img"
                    :artistName="artist.name"
                    :value="artist.id"
                    :artistId="artist.id"
                    v-model="selectedArtists"
                />
            </div>

            <div class="bottom">
                <div class="button-bg"></div>

                <button
                    type="button"
                    class="login-btn"
                    :class="{ active: selectedArtists.length >= 3 }"
                    :disabled="selectedArtists.length < 3"
                    @click="testButton"
                >
                    넘어가기
                </button>
            </div>
        </form>
    </main>
</template>

<script>
import ArtistSelectBtn from '@/components/ui/ArtistSelectBtn.vue';
import img1 from '@/assets/images/artist-select/1.png';
import img2 from '@/assets/images/artist-select/2.png';
import img3 from '@/assets/images/artist-select/3.png';
import img4 from '@/assets/images/artist-select/4.png';
import img5 from '@/assets/images/artist-select/5.png';
import img6 from '@/assets/images/artist-select/6.png';
import img7 from '@/assets/images/artist-select/7.png';
import img8 from '@/assets/images/artist-select/8.png';
import img9 from '@/assets/images/artist-select/9.png';
import img10 from '@/assets/images/artist-select/10.png';
import img11 from '@/assets/images/artist-select/11.png';
import img12 from '@/assets/images/artist-select/12.png';

export default {
    name: 'ArtistSelectView',
    components: { ArtistSelectBtn },
    data() {
        return {
            searchText: '',
            artists: [
                { id: 1, name: '아이유', img: img1 },
                { id: 2, name: '뉴진스', img: img2 },
                { id: 3, name: '아이브', img: img3 },
                { id: 4, name: '에스파', img: img4 },
                { id: 5, name: '르세라핌', img: img5 },
                { id: 6, name: '태연', img: img6 },
                { id: 7, name: '백예린', img: img7 },
                { id: 8, name: '악뮤', img: img8 },
                { id: 9, name: '윤하', img: img9 },
                { id: 10, name: '헤이즈', img: img10 },
                { id: 11, name: '키키', img: img11 },
                { id: 12, name: '엔믹스', img: img12 }
            ],
            selectedArtists: []
        };
    },
    computed: {
        remainingCount() {
            return Math.max(3 - this.selectedArtists.length, 0);
        },
        filteredArtists() {
            const keyword = this.searchText.trim();

            if (!keyword) return this.artists;

            return this.artists.filter((artist) => artist.name.includes(keyword));
        }
    },
    methods: {
        testButton() {
            if (this.selectedArtists.length < 3) return;

            const selectedNames = this.artists
                .filter((artist) => this.selectedArtists.includes(artist.id))
                .map((artist) => artist.name);

            alert(selectedNames.join(', '));
            this.$router.push('/signup-info');
        },
        searchArtist() {
            const keyword = this.searchText.trim();

            if (!keyword) return;

            const exists = this.artists.some((artist) => artist.name === keyword);

            if (!exists) {
                alert('목록에 없는 가수입니다.');
            }
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/artist-select-view.css"></style>

<style scoped>
.login-btn.active {
    background: var(--gradient-key);
    color: var(--color-white);
}

.login-btn:disabled {
    cursor: not-allowed;
    background-color: var(--color-gray);
}

.input::placeholder {
    color: var(--color-gray);
}
</style>
