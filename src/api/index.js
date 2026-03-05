import axios from 'axios';

const api = axios.create({
    baseURL: 'https://muteapp.dothome.co.kr/api',
    withCredentials: true, // ✅ 세션 쿠키 필수
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
