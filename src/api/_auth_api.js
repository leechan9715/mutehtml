import api from './api';

export const checkAuthApi = () => api.get('/auth/checkAuth.php');

export const checkNicknameApi = (nickname) => api.post('/auth/check_nickname.php', { nickname });

export const loginApi = ({ email, password, provider }) => api.post('/auth/login.php', { email, password, provider });

export const socialLoginApi = ({ provider, accessToken, nickname, profileImg, email }) =>
    api.post('/auth/social_login.php', {
        provider,
        accessToken,
        nickname,
        profileImg,
        email
    });

export const registerApi = ({ username, password, email, phone, nickname }) =>
    api.post('/auth/register.php', {
        username,
        password,
        email,
        phone,
        nickname
    });

export const logoutApi = () => api.post('/auth/logout.php');
