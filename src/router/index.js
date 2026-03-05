import { createRouter, createWebHistory } from 'vue-router';
import OnboardingLayout from '@/views/OnboardingFlow/OnboardingLayout.vue';
import SplashView from '@/views/OnboardingFlow/SplashView.vue';
import SignUp from '@/views/OnboardingFlow/SignUpView.vue';
import WelcomeView from '@/views/OnboardingFlow/WelcomeView.vue';
import MainLayout from '@/views/MainLayout.vue';
import MainView from '@/views/main/MainView.vue';
import ArtistSelectView from '@/views/OnboardingFlow/ArtistSelectView.vue';
import SignUpInfoView from '@/views/OnboardingFlow/SignUpInfoView.vue';
import MyPageView from '@/views/mypage/MyPageView.vue';
import TicketSelect from '@/views/ticket/TicketSelect.vue';
import Library from '@/views/library/Library.vue';
import Playlist from '@/views/playlist/playlist.vue';
import Player from '@/views/player/player.vue';
import ArtistInfo from '@/views/artistinfo/ArtistInfo.vue';

const routes = [
    {
        path: '/',
        component: OnboardingLayout,
        children: [
            { path: '', redirect: 'splash' },
            { path: 'splash', component: SplashView },
            { path: 'signup', component: SignUp },
            { path: 'signup-info', component: SignUpInfoView },
            { path: 'welcome', component: WelcomeView },
            { path: 'artist-select', component: ArtistSelectView }
        ]
    },
    {
        path: '/main',
        component: MainLayout,
        children: [
            { path: '', component: MainView, meta: { isProfile: true } },
            { path: '/mypage', component: MyPageView, meta: { isProfile: false } },
            { path: '/ticket-select', component: TicketSelect, meta: { isProfile: false } },
            { path: '/library', component: Library, meta: { isProfile: false } },
            { path: '/playlist', component: Playlist, meta: { isProfile: false } },
            { path: '/player', component: Player, meta: { isProfile: false } },
            { path: '/artist-info', component: ArtistInfo, meta: { isProfile: false } }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
