import { defineStore } from 'pinia';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        naverLogin: null,
        naverAccessToken: null
    })
});
