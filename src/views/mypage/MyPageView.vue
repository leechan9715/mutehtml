<template>
    <div class="container">
        <AppTopBar2 title="마이페이지"></AppTopBar2>
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
                <MenuListItem
                    v-for="(menu, index) in settingsMenus"
                    :key="index"
                    :icon="menu.icon"
                    :title="menu.title"
                    :link="menu.to"
                    :danger="menu.danger"
                />
            </ul>
        </div>
    </div>
</template>

<script>
import Logo from '@/components/ui/Logo.vue';
import AppTopBar2 from '@/components/layout/AppTopBar2.vue';
import profileImg from '@/assets/images/mypage/test.jpg';
import MenuListItem from '@/components/ui/MenuListItem.vue';

export default {
    name: 'MyPageView',
    components: {
        Logo,
        AppTopBar2,
        MenuListItem
    },
    data() {
        return {
            profileImg,
            settingsMenus: [
                { icon: 'notifications', title: '알림', to: '#' },
                { icon: 'local_activity', title: '쿠폰함', to: '#' },
                { icon: 'event_available', title: '이벤트/행사 정보', to: '#' },
                { icon: 'campaign', title: '공지사항', to: '#' },
                { icon: 'support_agent', title: '고객센터', to: '#' },
                { icon: 'accessibility', title: '접근성', to: '#' },
                { icon: 'info', title: '버전정보', to: '#' },
                { icon: 'logout', title: '로그아웃', to: '#', danger: true }
            ]
        };
    }
};
</script>

<style scoped src="@/assets/styles/pages/mypage.css"></style>
