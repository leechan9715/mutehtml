import { defineStore } from 'pinia';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: Boolean,
        AccessToken: null,
        provider: ''
    })
});
