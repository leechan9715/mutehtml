import api from './index';

export const checkAuthApi = () => api.get('/auth/check_login.php');

export const checkSocialLogin = () => api.get('/auth/check_social_login.php');

export const checkNicknameApi = (nickname) => api.post('/auth/check_nickname.php', { nickname });

export const loginApi = ({ email, password, provider }) => api.post('/auth/login.php', { email, password, provider });

export const socialLoginApi = ({ provider, accesstoken }) =>
    api.post('/auth/social_login.php', {
        provider,
        accesstoken
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
