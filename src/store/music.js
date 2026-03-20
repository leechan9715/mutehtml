import { defineStore } from 'pinia';

export const useMusicImageStore = defineStore('music', {
    actions: {
        upgradeArtwork(url = '', size = 600) {
            if (!url) return '';
            return url.replace(/\/\d+x\d+bb\.jpg$/, `/${size}x${size}bb.jpg`);
        }
    }
});
