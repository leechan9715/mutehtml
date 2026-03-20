import api from './api';

export const searchMusicByEmotion = (emotion) => api.post('/ai/music_search.php', { emotion });
