import { defineStore } from 'pinia';

export const useIsLoadingStore = defineStore('apiLoading', {
    state: () => ({
        isLoading: false
    }),
    actions: {
        setLoading(value) {
            this.isLoading = value;
        }
    }
});
