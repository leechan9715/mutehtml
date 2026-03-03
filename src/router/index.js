import { createRouter, createWebHistory } from 'vue-router';
import OnboardingLayout from '@/views/OnboardingFlow/OnboardingLayout.vue';
import SplashView from '@/views/OnboardingFlow/SplashView.vue';
import SignUp from '@/views/OnboardingFlow/SignUpView.vue';
import WelcomeView from '@/views/OnboardingFlow/WelcomeView.vue';
import SignUpInfoView from '@/views/OnboardingFlow/SignUpInfoView.vue';
import MainLayout from '@/views/main/MainLayout.vue';
import MainView from '@/views/main/MainView.vue';

const routes = [
    {
        path: '/',
        component: OnboardingLayout,
        children: [
            { path: '', redirect: 'splash' },
            { path: 'splash', component: SplashView },
            { path: 'signup', component: SignUp },
            { path: 'welcome', component: WelcomeView },
            { path: 'signup-info', component: SignUpInfoView }
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
