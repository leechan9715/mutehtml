import { createRouter, createWebHistory } from 'vue-router';

const OnboardingLayout = () => import('@/views/OnboardingFlow/OnboardingLayout.vue');
const SplashView = () => import('@/views/OnboardingFlow/SplashView.vue');
const SignUp = () => import('@/views/OnboardingFlow/SignUpView.vue');
const WelcomeView = () => import('@/views/OnboardingFlow/WelcomeView.vue');
const MainLayout2 = () => import('@/views/MainLayout-2.vue');
const MainView = () => import('@/views/main/MainView.vue');
const ArtistSelectView = () => import('@/views/OnboardingFlow/ArtistSelectView.vue');
const SignUpInfoView = () => import('@/views/OnboardingFlow/SignUpInfoView.vue');
const MyPageView = () => import('@/views/mypage/MyPageView.vue');
const ChartView = () => import('@/views/Chart/ChartView.vue');
const Search = () => import('@/views/search/search.vue');
const SearchResult = () => import('@/views/search/search-result.vue');
const Loading = () => import('@/views/OnboardingFlow/loading.vue');
const TicketSelect = () => import('@/views/ticket/TicketSelect.vue');
const Library = () => import('@/views/library/Library.vue');
const PlaylistDetailView = () => import('@/views/library/LibraryDetail.vue');
const Playlist = () => import('@/views/playlist/playlist.vue');
const Player = () => import('@/views/player/player.vue');
const ArtistInfo = () => import('@/views/artistinfo/ArtistInfo.vue');
const VideoDetail = () => import('@/views/VideoDetail/VideoDetail.vue');
const Ai = () => import('@/views/ai/Ai.vue');

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
            { path: 'chart', component: ChartView, meta: { isProfile: true } },
            { path: 'mypage', component: MyPageView, meta: { isProfile: false } },
            { path: 'ticket-select', component: TicketSelect, meta: { isProfile: false } },
            { path: 'library', component: Library, meta: { isProfile: true } },
            { path: 'library/:id', component: PlaylistDetailView, meta: { isProfile: true } },
            { path: 'playlist', component: Playlist, meta: { isProfile: true } },
            { path: 'player/:id', component: Player, meta: { isProfile: false } },
            { path: 'artist-info', component: ArtistInfo, meta: { isProfile: true } },
            { path: 'search-result', component: SearchResult, meta: { isProfile: true } },
            { path: 'video-detail/:id', component: VideoDetail, meta: { isProfile: true } },
            { path: 'ai', component: Ai, meta: { isProfile: false } },
            { path: 'ticket', component: TicketSelect, meta: { isProfile: false } }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
