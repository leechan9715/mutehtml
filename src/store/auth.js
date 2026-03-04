import { defineStore } from 'pinia';
import api from '@/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: null,
        _bootstrapChecked: false
    }),

    actions: {
        async checkAuth(force = false) {
            if (this._bootstrapChecked && !force) return;

            try {
                const { data } = await api.get('/auth/check_login.php');
                this.isLoggedIn = !!data.logged_in;

                // 서버가 username만 주면 이렇게
                this.user = data.logged_in ? { username: data.username } : null;
            } catch (e) {
                this.isLoggedIn = false;
                this.user = null;
            } finally {
                this._bootstrapChecked = true;
            }
        },

        async login(username, password) {
            const { data } = await api.post('/auth/login.php', { username, password });
            if (!data?.success) throw new Error('login failed');
            await this.checkAuth(true);
        },

        async register(username, password) {
            const { data } = await api.post('/auth/register.php', { username, password });
            if (!data?.success) throw new Error('register failed');
        },

        async logout() {
            await api.post('/auth/logout.php', {});
            this.isLoggedIn = false;
            this.user = null;
            this._bootstrapChecked = true;
        }
    }
});
