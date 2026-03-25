import { defineStore } from 'pinia';
import { checkAuthApi } from '@/api/_auth_api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        AccessToken: null,
        provider: '',
        isLoggedIn: false,
        naverAccessToken: null,
        authData: null,
        lastFetchedAt: 0,
        isAuthLoaded: false
    }),
    /* 일반 로그인 */
    actions: {
        setLocalStroge() {
            this.isLoggedIn = true;
            localStorage.setItem(
                'login-check',
                JSON.stringify({
                    isLoggedIn: this.isLoggedIn
                })
            );
        },
        async fetchAuthData(options = {}) {
            const { force = false, maxAgeMs = 5 * 60 * 1000 } = options;
            const now = Date.now();
            const hasFreshCache = this.authData && this.lastFetchedAt && now - this.lastFetchedAt < maxAgeMs;

            if (!force && hasFreshCache) {
                return this.authData;
            }

            const { data } = await checkAuthApi();
            this.authData = data;
            this.provider = data?.provider || this.provider;
            this.lastFetchedAt = now;
            this.isAuthLoaded = true;
            return data;
        },
        clearAuthState() {
            this.authData = null;
            this.provider = '';
            this.lastFetchedAt = 0;
            this.isAuthLoaded = false;
            this.AccessToken = null;
            this.naverAccessToken = null;
            this.isLoggedIn = false;
        }
    }
});
