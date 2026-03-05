<template>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <span class="material-symbols-outlined font-26 bold color-primary-3"> arrow_back </span>
            </div>
            <div class="col-3" style="margin: 0 auto">
                <h2 class="fw-semibold font-24 text-center">마이페이지</h2>
            </div>
            <div class="col-3" style="visibility: hidden">
                <span class="material-symbols-outlined font-26 bold color-primary-3"> arrow_back </span>
            </div>
        </div>
        <div class="row g-37">
            <Logo />
            <div class="col-1">
                <h3 class="fw-semibold color-primary-9 text-center">5,900/월</h3>
            </div>
        </div>
    </div>
    <form class="container" id="ticketForm">
        <div class="row g-23">
            <label class="col-3" for="basic" @click="select(0)">
                <p><span>Basic</span></p>
                <input type="radio" name="ticket" value="Basic" id="basic" checked class="hidden" />
            </label>
            <label class="col-3" for="standard" @click="select(1)">
                <p><span>Standard</span></p>
                <input type="radio" name="ticket" value="Standard" id="standard" class="hidden" />
            </label>
            <label class="col-3 premium" for="premium" @click="select(2)">
                <p><span>Premium</span></p>
                <input type="radio" name="ticket" value="Premium" id="premium" class="hidden" />
            </label>
        </div>
        <ul class="row g-38">
            <TicketSelectList v-for="(list, index) in menuList" :key="index" :icon="list.icon" :label="list.label" />
            <div class="col-1 btn">
                <button type="button" class="pay-btn" onclick="TestBtn()">결제하기</button>
            </div>
        </ul>
    </form>
</template>

<script>
import Logo from '@/components/ui/Logo.vue';
import TicketSelectList from '@/components/ui/TicketSelectList.vue';

export default {
    name: 'TicketSelect',
    components: {
        Logo,
        TicketSelectList
    },
    data() {
        return {
            menuList: [
                { icon: 'block', label: '광고제거' },
                { icon: 'person_heart', label: '맞춤추천' },
                { icon: 'video_library', label: '백그라운드 재생' },
                { icon: 'wifi_off', label: '오프라인 저장' },
                { icon: 'mobile_sound', label: '고음질 스트리밍' },
                { icon: 'stars_2', label: 'AI 비서' }
            ],
            row3: null,
            spans: [],
            checkBoxs: [],
            form: null,
            pos: ['6%', '40%', '74%']
        };
    },
    mounted() {
        // DOM 캐싱 (mounted에서만)
        this.row3 = document.querySelector('.container:nth-child(2) .row:nth-child(1)');
        this.spans = Array.from(document.querySelectorAll('.container:nth-child(2) .row:nth-child(1) span'));
        this.checkBoxs = Array.from(document.querySelectorAll("input[type='checkbox']"));
        this.form = document.querySelector('#ticketForm');

        console.log(this.checkBoxs);

        // 초기 선택
        this.select(0);
    },

    methods: {
        /* Basic Standard Premium 중 택1 클릭시 이벤트 함수 */
        select(i) {
            // span 색 초기화
            this.spans.forEach((s) => (s.style.color = 'black'));

            // 체크박스 초기화
            this.checkBoxs.forEach((cd) => (cd.checked = false));

            // 선택 span 강조
            if (this.spans[i]) this.spans[i].style.color = 'white';

            // i에 따라 체크할 체크박스 묶음
            const checkboxList = [
                [this.checkBoxs[0], this.checkBoxs[1]],
                [this.checkBoxs[0], this.checkBoxs[1], this.checkBoxs[2], this.checkBoxs[3]],
                [
                    this.checkBoxs[0],
                    this.checkBoxs[1],
                    this.checkBoxs[2],
                    this.checkBoxs[3],
                    this.checkBoxs[4],
                    this.checkBoxs[5]
                ]
            ];

            // CSS 변수 위치 이동
            if (this.row3) this.row3.style.setProperty('--bx', this.pos[i]);

            // 체크 적용
            (checkboxList[i] || []).forEach((cd) => {
                if (cd) cd.checked = true;
            });
        },

        /* Submit 데이터 출력 테스트 버튼 */
        TestBtn() {
            if (!this.form) return;
            const checked = this.form.querySelector("input[name='ticket']:checked");
            const value = checked ? checked.value : '';
            alert(value);
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/ticketselect.css"></style>
