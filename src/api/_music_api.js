import publicApi from '@/api/publicApi.js';

export const mainShortsApi = () => publicApi.get('/music/short_list.php');

export const mainKpopApi = () => publicApi.get('/music/kpop_ranking.php');

export const mainGlobalApi = () => publicApi.get('/music/global_ranking.php');

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

export const lastfmAlbumInfoApi = ({ apiKey, artist, album, format, autocorrect = 1 }) =>
    publicApi.get('/lastfm/lastfm.php', {
        params: {
            method: 'album.getinfo',
            api_key: apiKey,
            artist,
            album,
            format,
            autocorrect
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
