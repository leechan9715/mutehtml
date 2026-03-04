import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import mixins from './mixins';
import '@/assets/styles/global/global.css';
import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App);

app.use(store);
app.use(router);
// app.use(vue3GoogleLogin, { client: '614192262554-fdu8f61954pg7a8s2pj03ss1h2nk09ck.apps.googleusercontent.com' });

// app.mixin(mixins);

// 🔥 로그인 세션 확인
store.dispatch('auth/checkAuth');

app.mount('#app');
