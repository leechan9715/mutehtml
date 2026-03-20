import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        AccessToken: null,
        provider: '',
        isLoggedIn: false,
        naverAccessToken: null
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
            console.log(localStorage.getItem('login-check'));
        }
    }
});
