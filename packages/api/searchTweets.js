import axios from 'axios';

export const searchTweet = (query) => {
    const url = `api/searchTweet`;
    return axios.post(url, { body: { q: JSON.stringify(query)}});
}