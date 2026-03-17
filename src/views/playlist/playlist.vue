<template>
    <section class="container">
        <AppTopBar />

        <div class="row playlist-info">
            <p class="p-1">다가올 여름, 뮤트의 추천 플레이리스트</p>
            <p class="p-2">
                올여름 차트를 점령할 숨은 명곡부터 청량감 넘치는 비트까지,<br />
                뮤트와 함께 가장 힙한 여름을 즐겨보세요.
            </p>
            <img src="../../assets/images//main/playlist/1.png" alt="" />
            <div class="info-type">
                <PlaylistInfo text="제작자 - 홍길동" />
                <PlaylistInfo :text="playlistMetaText" />
            </div>
        </div>
        <div class="control">
            <button><span class="material-symbols-outlined btn-st">favorite</span></button>
            <button><span class="material-symbols-outlined btn-st">download</span></button>
            <button @click="playAllMyPlaylist"><span class="material-symbols-outlined big">play_arrow</span></button>
            <button><span class="material-symbols-outlined btn-st">share</span></button>
            <button><span class="material-symbols-outlined btn-st">more_vert</span></button>
        </div>
        <div class="row music-list">
            <PlayListItem :tracks="tracks" @select-track="playMyPlaylistFromIndex" />
        </div>
    </section>
</template>

<script>
import AppTopBar from '@/components/layout/AppTopBar.vue';
import PlayListItem from '@/components/layout/PlayListItem.vue';
import PlaylistInfo from '@/components/ui/playlist-info.vue';

const MY_PLAYLIST_KEY = 'my-playlist';
const PLAYER_STATE_KEY = 'mute-player-state';

export default {
    name: 'PlayList',
    data() {
        return {
            // 이벤트 제거용 핸들러 저장
            _radioHandlers: [],
            _btnHandlers: [],
            tracks: []
        };
    },
    components: {
        PlayListItem,
        AppTopBar,
        PlaylistInfo
    },
    computed: {
        totalTrackCount() {
            return this.tracks.length;
        },
        totalDurationMs() {
            return this.tracks.reduce((sum, track) => {
                const duration =
                    Number(track?.trackTimeMillis) ||
                    Number(track?.durationMs) ||
                    (track?.previewUrl ? 30000 : 0);
                return sum + (Number.isFinite(duration) ? duration : 0);
            }, 0);
        },
        playlistMetaText() {
            const totalMinutes = Math.floor(this.totalDurationMs / 60000);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${this.totalTrackCount}곡 - ${hours}시간 ${minutes}분`;
        }
    },
    mounted() {
        this.loadTracksFromMyPlaylist();
        window.addEventListener('my-playlist-updated', this.onMyPlaylistUpdated);
        window.addEventListener('storage', this.onStorageUpdated);

        // ✅ 1) boundery-select 라디오 이미지 토글
        const columns = Array.from(document.querySelectorAll('.boundery-select .column'));

        const syncColumnImages = () => {
            columns.forEach((c) => {
                const r = c.querySelector("input[type='radio']");
                const i = c.querySelector('img');
                if (!r || !i) return;

                i.src = r.checked ? i.dataset.checkedSrc : i.dataset.uncheckedSrc;
            });
        };

        // 초기 상태 세팅
        syncColumnImages();

        // change 이벤트 등록 (각 라디오에)
        columns.forEach((column) => {
            const radio = column.querySelector("input[type='radio']");
            if (!radio) return;

            const handler = () => syncColumnImages();
            radio.addEventListener('change', handler);

            // 제거를 위해 저장
            this._radioHandlers.push({ el: radio, handler });
        });

        // ✅ 2) control 버튼 active + vibrate 토글
        const buttons = Array.from(document.querySelectorAll('.control button'));

        buttons.forEach((btn) => {
            const handler = () => {
                btn.classList.toggle('active');

                // vibrate 재시작 트릭
                btn.classList.remove('vibrate');
                void btn.offsetWidth;
                btn.classList.add('vibrate');
            };

            btn.addEventListener('click', handler);
            this._btnHandlers.push({ el: btn, handler });
        });
    },

    beforeUnmount() {
        window.removeEventListener('my-playlist-updated', this.onMyPlaylistUpdated);
        window.removeEventListener('storage', this.onStorageUpdated);

        // ✅ 컴포넌트 해제 시 이벤트 제거 (메모리 누수 방지)
        this._radioHandlers.forEach(({ el, handler }) => el.removeEventListener('change', handler));
        this._btnHandlers.forEach(({ el, handler }) => el.removeEventListener('click', handler));

        this._radioHandlers = [];
        this._btnHandlers = [];
    },
    methods: {
        loadTracksFromMyPlaylist(payload = null) {
            try {
                const playlist = payload ?? JSON.parse(localStorage.getItem(MY_PLAYLIST_KEY) || '[]');
                this.tracks = Array.isArray(playlist) ? playlist : [];
            } catch (e) {
                console.error('플레이리스트 로드 실패:', e);
                this.tracks = [];
            }
        },
        onMyPlaylistUpdated(event) {
            if (event?.detail) {
                this.loadTracksFromMyPlaylist(event.detail);
                return;
            }
            this.loadTracksFromMyPlaylist();
        },
        onStorageUpdated(event) {
            if (event?.key !== MY_PLAYLIST_KEY) return;
            this.loadTracksFromMyPlaylist();
        },
        playAllMyPlaylist() {
            this.playMyPlaylistFromIndex(0);
        },
        playMyPlaylistFromIndex(clickedIndex = 0) {
            const tracks = (this.tracks || [])
                .map((item) => ({
                    previewUrl: item?.previewUrl || '',
                    artistName: item?.artistName || '',
                    trackName: item?.trackName || '',
                    albumCover: item?.albumCover || ''
                }))
                .filter((item) => item.trackName);

            if (!tracks.length) return;

            let currentIndex = Number.isInteger(clickedIndex) ? clickedIndex : 0;
            if (currentIndex < 0 || currentIndex >= tracks.length) currentIndex = 0;

            if (!tracks[currentIndex]?.previewUrl) {
                const playableIndex = tracks.findIndex((item, index) => index >= currentIndex && !!item.previewUrl);
                if (playableIndex >= 0) currentIndex = playableIndex;
            }
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

<style scoped src="@/assets/styles/pages/playlist.css"></style>
