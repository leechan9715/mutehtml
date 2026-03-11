import axios from 'axios';

const publicApi = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost/backend/api/' : '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default publicApi;
