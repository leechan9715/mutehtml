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
        <div class="row">
            <div class="col-1">
                <h3 class="sub-title">프로필</h3>
            </div>
            <div class="col-1 profile_container">
                <img :src="profileImg" alt="user_img" />
                <div class="profile_box">
                    <p class="font-14 fw-medium">홍길동</p>
                    <p class="color-gray font-14 fw-medium">1234@google.com</p>
                </div>
                <span class="material-symbols-outlined"> arrow_forward_ios </span>
            </div>
        </div>
        <div class="row">
            <div class="col-2">
                <h3 class="sub-title">이용권 관리</h3>
            </div>
            <div class="col-2">
                <span class="material-symbols-outlined font-18 rag color-primary-3"> arrow_forward_ios </span>
            </div>
            <div class="col-1 ticket-container">
                <div class="ticket-box">
                    <h3 class="font-20 fw-bold">Free</h3>
                    <p class="font-14">
                        지금 이용권을 구매하고<br />
                        무제한으로 음악을 즐기세요.
                    </p>
                </div>
                <Logo />
            </div>
        </div>
        <div class="row">
            <h3 class="col-1 sub-title fw-800">설정</h3>
            <ul>
                <li>
                    <a href="#">
                        <span class="material-symbols-outlined bold">notifications</span>
                        <p>알림</p>
                        <span class="material-symbols-outlined font-18 thin"> arrow_forward_ios </span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span class="material-symbols-outlined bold">local_activity</span>
                        <p>쿠폰함</p>
                        <span class="material-symbols-outlined font-18 thin"> arrow_forward_ios </span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span class="material-symbols-outlined bold">event_available</span>
                        <p>이벤트/행사 정보</p>
                        <span class="material-symbols-outlined font-18 thin"> arrow_forward_ios </span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span class="material-symbols-outlined bold">campaign</span>
                        <p>공지사항</p>
                        <span class="material-symbols-outlined font-18 thin"> arrow_forward_ios </span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span class="material-symbols-outlined bold">support_agent</span>
                        <p>고객센터</p>
                        <span class="material-symbols-outlined font-18 thin"> arrow_forward_ios </span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span class="material-symbols-outlined bold">accessibility</span>
                        <p>접근성</p>
                        <span class="material-symbols-outlined font-18 thin"> arrow_forward_ios </span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span class="material-symbols-outlined bold">info</span>
                        <p>버전정보</p>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span class="material-symbols-outlined color-red bold">logout</span>
                        <p>로그아웃</p>
                        <span class="material-symbols-outlined font-18 thin"> arrow_forward_ios </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Logo from '@/components/ui/Logo.vue';
import profileImg from '@/assets/images/mypage/test.jpg';

export default {
    name: 'MyPageView',
    components: {
        Logo
    },
    data() {
        return {
            profileImg
        };
    }
};
</script>

<style scoped src="@/assets/styles/pages/mypage.css"></style>
