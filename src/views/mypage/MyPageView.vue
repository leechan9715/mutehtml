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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/ui/Logo.vue';
import AppTopBar2 from '@/components/layout/AppTopBar2.vue';
import MenuListItem from '@/components/ui/MenuListItem.vue';
import profileImgSrc from '@/assets/images/mypage/test.jpg';
import { checkAuthApi, checkSocialLogin, logoutApi } from '@/api/_auth_api';
const router = useRouter();
const profileImg = profileImgSrc;

const settingsMenus = ref([
    { icon: 'notifications', title: '알림', to: '#' },
    { icon: 'local_activity', title: '쿠폰함', to: '#' },
    { icon: 'event_available', title: '이벤트/행사 정보', to: '#' },
    { icon: 'campaign', title: '공지사항', to: '#' },
    { icon: 'support_agent', title: '고객센터', to: '#' },
    { icon: 'accessibility', title: '접근성', to: '#' },
    { icon: 'info', title: '버전정보', to: '#' }
]);

const localLoginData = ref({});
const socialLoginData = ref({});
const naverAccessToken = ref();
onMounted(async () => {
    try {
        const { data } = await checkAuthApi();
        localLoginData.value = data;
        console.log(localLoginData.value);
    } catch (e) {
        console.error('로컬 로그인 체크 실패', e);
    }
    try {
        const { data } = await checkSocialLogin();
        socialLoginData.value = data;
        naverAccessToken.value = data.accesstoken;
    } catch (e) {
        console.error('소셜 로그인 체크 실패', e);
    }
});

const logout = () => {
    if (socialLoginData.value?.provider === 'kakao') {
        kakaoLogout();

        return;
    }

    if (socialLoginData.value?.provider === 'naver') {
        naverLogout();
        return;
    }

    if (socialLoginData.value?.provider === 'google') {
        googleLogout();
        return;
    }

    if (localLoginData.value?.provider === 'local') {
        localLogout();
        return;
    }
};

const clearClientState = () => {
    localStorage.removeItem('login-check');
    localStorage.removeItem('selectedArtists');
    localStorage.removeItem('mute-player-state');
    localStorage.removeItem('track');
    window.dispatchEvent(new CustomEvent('mute-player-state-updated'));
};

const localLogout = async () => {
    clearClientState();
    await logoutApi();
    alert('로컬 정상적으로 로그아웃되었습니다.');
    router.push('/');
};
const googleLogout = async () => {
    clearClientState();
    await logoutApi();
    alert('구글 정상적으로 로그아웃되었습니다.');
    router.push('/');
};
const kakaoLogout = async () => {
    try {
        // 1. 카카오 SDK가 있고 초기화되어 있으면 카카오 토큰 로그아웃
        if (window.Kakao && window.Kakao.isInitialized()) {
            const kakaoToken = window.Kakao.Auth.getAccessToken();
            if (kakaoToken) {
                await new Promise((resolve) => {
                    window.Kakao.Auth.logout(() => {
                        resolve();
                    });
                });
            }
        }

        // 2. 우리 서버 세션 로그아웃은 항상 실행
        await logoutApi();

        // 3. 클라이언트 저장값 제거
        clearClientState();
        alert('카카오 정상적으로 로그아웃되었습니다.');
        router.push('/');
    } catch (error) {
        console.error('카카오 로그아웃 실패:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
    }
};
const naverLogout = async () => {
    if (!naverAccessToken.value) {
        alert('로그인 상태가 아닙니다.');
        return;
    }
    const logoutUrl = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=mtjjmyTeqJxD3JTzSSKD&client_secret=1WUIDotelN&access_token=${naverAccessToken.value}&service_provider=NAVER`;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = logoutUrl;
    document.body.appendChild(iframe);

    // ✅ 네이버 SDK가 저장한 sessionStorage 직접 삭제

    clearClientState();
    await logoutApi();
    alert('네이버 정상적으로 로그아웃되었습니다.');
    router.push('/');
};

console.log(naverAccessToken.value);
</script>
<style scoped src="@/assets/styles/pages/mypage.css"></style>
