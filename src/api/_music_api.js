import publicApi from '@/api/publicApi.js';

export const mainShortsApi = () => publicApi.get('/music/short_list.php');

export const searchApi = ({ term, country, media, entity, limit }) =>
    publicApi.get('/itunes/search.php', {
        params: {
            term,
            country,
            media,
            entity,
            limit
        }
    });

export const lastfmKoreaTopTracksApi = ({ page = 1, limit = 50 } = {}) =>
    publicApi.get('/lastfm/lastfm.php', {
        params: {
            method: 'geo.gettoptracks',
            country: 'Korea, Republic of',
            api_key: process.env.VUE_APP_LASTFM_API_KEY,
            format: 'json',
            limit,
            page
        }
    });

export const lastfmGlobalTopTracksApi = ({ page = 1, limit = 50 } = {}) =>
    publicApi.get('/lastfm/lastfm.php', {
        params: {
            method: 'chart.gettoptracks',
            api_key: process.env.VUE_APP_LASTFM_API_KEY,
            format: 'json',
            limit,
            page
        }
    });

export const getVideoApi = (id) =>
    publicApi.get('/music/videos.php', {
        params: {
            id
        }
    });
export const commentAddApi = ({ postid, writer, content }) =>
    publicApi.post('/auth/comment_insert.php', {
        post_id: postid,
        writer: writer,
        content: content
    });

export const getCommentsApi = (id) => publicApi.get(`/auth/comment_list.php?post_id=${id}`);
