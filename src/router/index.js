import { createRouter, createWebHistory } from 'vue-router';
import OnboardingLayout from '@/views/OnboardingFlow/OnboardingLayout.vue';
import SplashView from '@/views/OnboardingFlow/SplashView.vue';
import SignUp from '@/views/OnboardingFlow/SignUpView.vue';
import WelcomeView from '@/views/OnboardingFlow/WelcomeView.vue';
import MainLayout from '@/views/MainLayout.vue';
import MainLayout2 from '@/views/MainLayout-2.vue';
import MainView from '@/views/main/MainView.vue';
import ArtistSelectView from '@/views/OnboardingFlow/ArtistSelectView.vue';
import SignUpInfoView from '@/views/OnboardingFlow/SignUpInfoView.vue';
import MyPageView from '@/views/mypage/MyPageView.vue';
import ChartView from '@/views/Chart/ChartView.vue';
import Search from '@/views/search/search.vue';
import SearchResult from '@/views/search/search-result.vue';
import Loading from '@/views/OnboardingFlow/loading.vue';
import TicketSelect from '@/views/ticket/TicketSelect.vue';
import Library from '@/views/library/Library.vue';
import Playlist from '@/views/playlist/playlist.vue';
import Player from '@/views/player/player.vue';
import ArtistInfo from '@/views/artistinfo/ArtistInfo.vue';
import VideoDetail from '@/views/VideoDetail/VideoDetail.vue';

const routes = [
    {
        path: '',
        component: OnboardingLayout,
        children: [
            { path: '', redirect: '/splash' },
            { path: 'splash', component: SplashView },
            { path: 'signup', component: SignUp },
            { path: 'signup-info', component: SignUpInfoView },
            { path: 'welcome', component: WelcomeView },
            { path: 'artist-select', component: ArtistSelectView },
            { path: 'loading', component: Loading }
        ]
    },
    {
        path: '/main',
        component: MainLayout2,
        children: [
            { path: '', component: MainView, meta: { isProfile: true } },
            { path: 'search', component: Search, meta: { isProfile: true } },
            { path: 'chart', component: ChartView, meta: { isProfile: true } }
        ]
    },
    {
        path: '/main',
        component: MainLayout,
        children: [
            { path: 'mypage', component: MyPageView },
            { path: 'chart', component: ChartView },
            { path: 'ticket-select', component: TicketSelect },
            { path: 'library', component: Library },
            { path: 'playlist', component: Playlist },
            { path: 'player', component: Player },
            { path: 'artist-info', component: ArtistInfo },
            { path: 'search-result', component: SearchResult }
        ]
    },
    {
        path: '/videos/:id',
        name: 'videoDetail',
        component: VideoDetail
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
