import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { pinia, useAuthStore } from './store';

import '@/assets/styles/global/global.css';
import vue3GoogleLogin from 'vue3-google-login';
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(vue3GoogleLogin, { client: '614192262554-fdu8f61954pg7a8s2pj03ss1h2nk09ck.apps.googleusercontent.com' });
app.mount('#app');

/* 일반 로그인 */
// const authStore = useAuthStore();
// authStore.checkAuth();
