import axios from 'axios';

const api = axios.create({
    baseURL: process.env.VUE_APP_NODE_ENV === 'development' ? 'http://localhost/backend/api' : '/api',
    withCredentials: true, // ✅ 세션 쿠키 필수
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
