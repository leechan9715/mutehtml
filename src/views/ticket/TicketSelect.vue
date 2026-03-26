<template>
    <div class="container">
        <AppTopBar2 title="이용권선택" />
        <div class="row g-37">
            <Logo />
            <div class="col-1">
                <h3 class="fw-semibold color-primary-9 text-center">5,900/월</h3>
            </div>
        </div>
    </div>

    <form class="container" id="ticketForm">
        <!-- 요금제 선택 -->
        <div class="row g-23 tab-row">
            <label class="col-3" :class="{ active: selected === 0 }" @click="select(0)">
                <p><span>Basic</span></p>
                <input type="radio" name="ticket" value="Basic" class="hidden" />
            </label>

            <label class="col-3" :class="{ active: selected === 1 }" @click="select(1)">
                <p><span>Standard</span></p>
                <input type="radio" name="ticket" value="Standard" class="hidden" />
            </label>

            <label class="col-3 premium" :class="{ active: selected === 2 }" @click="select(2)">
                <p><span>Premium</span></p>
                <input type="radio" name="ticket" value="Premium" class="hidden" />
            </label>
        </div>

        <!-- 기능 리스트 -->
        <ul class="row g-38">
            <TicketSelectList v-for="(list, index) in menuList" :key="index" :icon="list.icon" :label="list.label" />

            <div class="col-1 btn">
                <button type="button" class="pay-btn" @click="TestBtn">결제하기</button>
            </div>
        </ul>
    </form>
</template>

<script>
import AppTopBar2 from '@/components/layout/AppTopBar2.vue';
import Logo from '@/components/ui/Logo.vue';
import TicketSelectList from '@/components/ui/TicketSelectList.vue';

export default {
    name: 'TicketSelect',
    components: {
        Logo,
        TicketSelectList,
        AppTopBar2
    },
    data() {
        return {
            selected: 0,

            menuList: [
                { icon: 'block', label: '광고제거' },
                { icon: 'person_heart', label: '맞춤추천' },
                { icon: 'video_library', label: '백그라운드 재생' },
                { icon: 'wifi_off', label: '오프라인 저장' },
                { icon: 'mobile_sound', label: '고음질 스트리밍' },
                { icon: 'stars_2', label: 'AI 비서' }
            ],

            checkBoxs: [],
            form: null,
            row3: null,
            pos: ['6%', '40%', '74%']
        };
    },

    mounted() {
        this.row3 = document.querySelector('.tab-row');
        this.checkBoxs = Array.from(document.querySelectorAll("input[type='checkbox']"));
        this.form = document.querySelector('#ticketForm');

        this.select(0);
    },

    methods: {
        select(i) {
            this.selected = i;

            // 체크박스 초기화
            this.checkBoxs.forEach((cd) => (cd.checked = false));

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

            if (this.row3) this.row3.style.setProperty('--bx', this.pos[i]);

            (checkboxList[i] || []).forEach((cd) => {
                if (cd) cd.checked = true;
            });
        },

        TestBtn() {
            const ticketList = ['Basic', 'Standard', 'Premium'];
            const value = ticketList[this.selected];
            const messageMap = {
                Basic: '베이직 결제가 완료되었습니다.',
                Standard: '스탠다드 결제가 완료되었습니다.',
                Premium: '프리미엄 결제가 완료되었습니다.'
            };
            if (!value) {
                alert('이용권을 선택해주세요.');
                return;
            }
            alert(messageMap[value]);
            this.$router.push('/main');
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/ticketselect.css"></style>
