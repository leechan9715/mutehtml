import axios from 'axios';

export async function $api(url, method, data = null) {
    try {
        const response = await axios({
            method,
            url,
            ...(method.toUpperCase() === 'GET' ? { params: data } : { data })
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}
