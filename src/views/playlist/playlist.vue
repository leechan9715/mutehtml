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
                <p>제작자 - 홍길동</p>
                <p>103곡 - 5시간 20분</p>
            </div>
        </div>
        <div class="control">
            <button><span class="material-symbols-outlined btn-st">favorite</span></button>
            <button><span class="material-symbols-outlined btn-st">download</span></button>
            <button><span class="material-symbols-outlined big">play_arrow</span></button>
            <button><span class="material-symbols-outlined btn-st">share</span></button>
            <button><span class="material-symbols-outlined btn-st">more_vert</span></button>
        </div>
        <div class="row music-list">
            <PlayListItem />
        </div>
    </section>
</template>

<script>
import AppTopBar from '@/components/layout/AppTopBar.vue';
import PlayListItem from '@/components/layout/PlayListItem.vue';

export default {
    name: 'PlayList',
    data() {
        return {
            // 이벤트 제거용 핸들러 저장
            _radioHandlers: [],
            _btnHandlers: []
        };
    },
    components: {
        PlayListItem,
        AppTopBar
    },
    mounted() {
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
        // ✅ 컴포넌트 해제 시 이벤트 제거 (메모리 누수 방지)
        this._radioHandlers.forEach(({ el, handler }) => el.removeEventListener('change', handler));
        this._btnHandlers.forEach(({ el, handler }) => el.removeEventListener('click', handler));

        this._radioHandlers = [];
        this._btnHandlers = [];
    }
};
</script>

<style scoped src="@/assets/styles/pages/playlist.css"></style>
