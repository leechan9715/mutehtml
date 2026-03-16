<template>
    <header class="container" v-if="isProfile">
        <!-- 시간출력 부분 -->
        <!-- <div class="row">
            <div class="col-2">
                <p class="time">{{ time }}</p>
            </div>
            <div class="col-2">
                <span class="material-symbols-outlined"> android_cell_4_bar </span>
                <span class="material-symbols-outlined"> wifi </span>
                <span class="material-symbols-outlined"> battery_android_frame_full </span>
            </div>
        </div> -->
        <!-- 프로필 헤더 부분 -->
        <div class="row">
            <div class="col-2">
                <img :src="logo" alt="logo" />
            </div>
            <div class="col-2">
                <router-link to="/main/mypage">
                    <img :src="authData?.user?.profileImg || defaultImg" alt="test-img" />
                </router-link>
            </div>
        </div>
    </header>
</template>

<script>
import clockMixin from '@/mixins/clockMixin';
import logo from '@/assets/images/common/logo.png';
import defaultImg from '@/assets/images/mypage/test.jpg';
import { checkAuthApi } from '@/api/_auth_api';
export default {
    name: 'AppHeader',
    mixins: [clockMixin],
    props: {
        isProfile: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    data() {
        return {
            logo,
            defaultImg,
            authData: null
        };
    },
    mounted() {
        this.checkAuthData();
    },
    methods: {
        async checkAuthData() {
            const { data } = await checkAuthApi();
            this.authData = data;
            console.log('로그인한 데이터 ', data);
        }
    }
};
</script>

<style scoped>
header {
    position: relative;
    z-index: 9999;
}
header.container {
    padding: 20px 25px;
    gap: 25px;
    background-color: #fff;
    box-shadow:
        inset 0px -7px 10px var(--color-shadow),
        0px -3px 10px var(--color-shadow);
}

/* header .row:nth-child(1) {
    justify-content: space-between;
}

header .row:nth-child(1) .col-2:nth-child(2) {
    display: flex;
    gap: 7px;
} */

header .row:nth-child(1) {
    justify-content: space-between;
    align-items: center;
}

header .row:nth-child(1) .col-2:nth-child(1) {
    max-width: 90px;
}

header .row:nth-child(1) .col-2:nth-child(1) img {
    width: 100%;
}

header .row:nth-child(1) .col-2:nth-child(2) {
    border-radius: 12px;
    width: 42px;
}

header .row:nth-child(1) .col-2:nth-child(2) img {
    object-fit: cover;
    border-radius: 12px;
}

header .row .col-2 .time {
    font-weight: 600;
}
</style>
