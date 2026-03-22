<template>
    <div class="container">
        <AppTopBar2 title="마이페이지" />
        <div class="row">
            <div class="col-1">
                <h3 class="sub-title profile-title">프로필</h3>
            </div>
            <div class="col-1 profile_container">
                <img :src="authData?.user?.profileImg || defaultProfileImg" alt="user_img" />
                <div class="profile_box">
                    <p class="fw-medium">{{ authData?.user?.nickname }}</p>
                    <p class="color-gray fw-medium">{{ authData?.user?.email }}</p>
                </div>
            </div>
        </div>
        <div class="row use-auto">
            <div class="auto">
                <div class="col-2">
                    <h3 class="sub-title use-title">이용권 관리</h3>
                </div>
                <div class="col-2">
                    <router-link to="ticket">
                        <img :src="require('@/assets/images/icon/right-arrow.png')" class="arrow"
                    /></router-link>
                </div>
            </div>
            <div class="col-1 ticket-container"></div>
        </div>
        <div class="row">
            <h3 class="col-1 sub-title">설정</h3>
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
                        <span class="material-symbols-outlined color-red bold logicon">logout</span>
                        <p>로그아웃</p>
                        <img :src="require('@/assets/images/icon/right-arrow.png')" class="arrow" />
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import AppTopBar2 from '@/components/layout/AppTopBar2.vue';
import MenuListItem from '@/components/ui/MenuListItem.vue';
import profileImgSrc from '@/assets/images/mypage/test.jpg';
import { logoutApi } from '@/api/_auth_api';
import { useAuthStore } from '@/store/auth';
const router = useRouter();
const defaultProfileImg = profileImgSrc;
const authStore = useAuthStore();
const { authData } = storeToRefs(authStore);

const settingsMenus = ref([
    { icon: 'notifications', title: '알림', to: '#' },
    { icon: 'local_activity', title: '쿠폰함', to: '#' },
    { icon: 'event_available', title: '이벤트/행사 정보', to: '#' },
    { icon: 'campaign', title: '공지사항', to: '#' },
    { icon: 'support_agent', title: '고객센터', to: '#' },
    { icon: 'accessibility', title: '접근성', to: '#' },
    { icon: 'info', title: '버전정보', to: '#' }
]);

const naverAccessToken = ref();

onMounted(async () => {
    try {
        await authStore.fetchAuthData();
    } catch (e) {
        console.error('로그인이 안되있습니다.', e);
    }
});

const logout = () => {
    if (authData.value?.provider === 'kakao') {
        kakaoLogout();

        return;
    }

    if (authData.value?.provider === 'naver') {
        naverLogout();
        return;
    }

    if (authData.value?.provider === 'google') {
        googleLogout();
        return;
    }

    if (authData.value?.provider === 'local') {
        localLogout();
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
    authStore.clearAuthState();
    alert('로컬 정상적으로 로그아웃되었습니다.');
    router.push('/');
};
const googleLogout = async () => {
    clearClientState();
    await logoutApi();
    authStore.clearAuthState();
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
        authStore.clearAuthState();
        alert('카카오 정상적으로 로그아웃되었습니다.');
        router.push('/');
    } catch (error) {
        console.error('카카오 로그아웃 실패:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
    }
};
const naverLogout = async () => {
    naverAccessToken.value = authData.value?.accessToken;
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
    authStore.clearAuthState();
    alert('네이버 정상적으로 로그아웃되었습니다.');
    router.push('/');
};
</script>
<style scoped src="@/assets/styles/pages/mypage.css"></style>
