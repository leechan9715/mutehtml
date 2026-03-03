import { createRouter, createWebHistory } from 'vue-router';
import OnboardingLayout from '@/views/OnboardingFlow/OnboardingLayout.vue';
import SplashView from '@/views/OnboardingFlow/SplashView.vue';
import SignUp from '@/views/OnboardingFlow/SignUpView.vue';
import WelcomeView from '@/views/OnboardingFlow/WelcomeView.vue';
import SignUpInfoView from '@/views/OnboardingFlow/SignUpInfoView.vue';
import MainLayout from '@/views/main/MainLayout.vue';
import MainView from '@/views/main/MainView.vue';
import ArtistSelectView from '@/views/OnboardingFlow/ArtistSelectView.vue';
import SignUpGoogle from '@/views/OnboardingFlow/SignUpGoogle.vue';
import SignUpNaverView from '@/views/OnboardingFlow/SignUpNaverView.vue';

const routes = [
    {
        path: '/',
        component: OnboardingLayout,
        children: [
            { path: '', redirect: 'splash' },
            { path: 'splash', component: SplashView },
            { path: 'signup', component: SignUpNaverView },
            { path: 'signup-info', component: SignUpInfoView },
            { path: 'welcome', component: WelcomeView },
            { path: 'artist-select', component: ArtistSelectView }
        ]
    },
    {
        path: '/main',
        component: MainLayout,
        children: [{ path: '', component: MainView, meta: { isProfile: true } }]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
