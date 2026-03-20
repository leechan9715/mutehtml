import { createPinia } from 'pinia';
import { useAuthStore } from './auth'; // Auth 스토어 가져오기

const pinia = createPinia();

export { pinia, useAuthStore }; // Pinia 인스턴스와 Auth 스토어 내보내기
