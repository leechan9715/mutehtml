import { defineStore } from 'pinia';
/* 일반 로그인 */
import api from '@/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        AccessToken: null,
        provider: '',
        isLoggedIn: Boolean,
        naverAccessToken: null
    }),
    /* 일반 로그인 */
    actions: {
        async checkAuth(force = false) {
            if (this._bootstrapChecked && !force) return;
            try {
                const { data } = await api.get('/auth/check_login.php');
                this.isLoggedIn = !!data.logged_in;
                this.user = data.logged_in ? (data.user ?? { email: data.email }) : null;
            } catch (e) {
                this.isLoggedIn = false;
                this.user = null;
            } finally {
                this._bootstrapChecked = true;
            }
        },

        async login({ email, password }) {
            const { data } = await api.post('/auth/login.php', { email, password });
            if (!data?.success) throw new Error('login failed');
            await this.checkAuth(true);
        },

        async register({ username, password, email, phone, nickname }) {
            const { data } = await api.post('/auth/register.php', {
                username,
                password,
                email,
                phone,
                nickname
            });
            if (!data?.success) throw new Error(data?.message || 'register failed');
        },

        async logout() {
            await api.post('/auth/logout.php', {});
            this.isLoggedIn = false;
            this.user = null;
            this._bootstrapChecked = true;
        }
    }
});
