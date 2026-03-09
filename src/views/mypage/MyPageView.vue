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
                />
                <li>
                    <router-link to="/" @click.prevent="logout">
                        <span class="material-symbols-outlined color-red bold">logout</span>
                        <p>로그아웃</p>
                        <span class="material-symbols-outlined font-18 thin"> arrow_forward_ios </span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/ui/Logo.vue';
import AppTopBar2 from '@/components/layout/AppTopBar2.vue';
import MenuListItem from '@/components/ui/MenuListItem.vue';
import profileImgSrc from '@/assets/images/mypage/test.jpg';
import { useAuthStore } from '@/store/auth';
const auth = useAuthStore();
const router = useRouter();
// ✅ data() -> script setup (반응형 필요 없으면 const로 둬도 됨)
const profileImg = profileImgSrc;
const auth_check = JSON.parse(localStorage.getItem('login-check'));
const provider = auth_check.provider || '';
const accessToken = auth_check.AccessToken || null;

const settingsMenus = ref([
    { icon: 'notifications', title: '알림', to: '#' },
    { icon: 'local_activity', title: '쿠폰함', to: '#' },
    { icon: 'event_available', title: '이벤트/행사 정보', to: '#' },
    { icon: 'campaign', title: '공지사항', to: '#' },
    { icon: 'support_agent', title: '고객센터', to: '#' },
    { icon: 'accessibility', title: '접근성', to: '#' },
    { icon: 'info', title: '버전정보', to: '#' }
]);

const logout = () => {
    if (provider === 'kakao') {
        kakaoLogout();
    }

    if (provider === 'naver') {
        naverLogout();
    }

    if (provider === 'google') {
        googleLogout();
    }
    if (provider === 'local') {
        localLogout();
    } else {
        return;
    }
};

const localLogout = () => {
    localStorage.removeItem('login-check');
    alert('로컬 정상적으로 로그아웃되었습니다.');
    router.push('/');
};
const googleLogout = () => {
    console.log(auth.isLoggedIn, auth.provider);
    console.log('googleLogout');
    localStorage.removeItem('login-check');
    alert('구글 정상적으로 로그아웃되었습니다.');
    router.push('/');
};
const kakaoLogout = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) return;
    if (window.Kakao.Auth.getAccessToken()) {
        window.Kakao.Auth.logout(() => {
            localStorage.removeItem('login-check');
            alert('카카오 정상적으로 로그아웃되었습니다.');
            router.push('/');
        });
    } else {
        alert('이미 로그아웃 상태입니다.');
    }
};
const naverLogout = () => {
    if (!accessToken) {
        alert('로그인 상태가 아닙니다.');
        return;
    }
    const logoutUrl = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=mtjjmyTeqJxD3JTzSSKD&client_secret=1WUIDotelN&access_token=${accessToken}&service_provider=NAVER`;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = logoutUrl;
    document.body.appendChild(iframe);

    // ✅ 네이버 SDK가 저장한 sessionStorage 직접 삭제

    localStorage.removeItem('login-check');
    alert('네이버 정상적으로 로그아웃되었습니다.');
    router.push('/');
};
</script>
<style scoped src="@/assets/styles/pages/mypage.css"></style>
