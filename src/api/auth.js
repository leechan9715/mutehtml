import api from './index';

export const checkNickname = (nickname) => api.post('/auth/check_nickname.php', { nickname });
