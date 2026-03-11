import publicApi from '@/api/publicApi.js';

export const mainShortsApi = () => publicApi.get('/music/short_list.php');

export const mainKpopApi = () => publicApi.get('/music/kpop_ranking.php');

export const mainGlobalApi = () => publicApi.get('/music/global_ranking.php');
