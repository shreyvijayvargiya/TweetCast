import axios from 'axios';

export const searchUsersApi = (query) => {
    const url = `api/searchUsers`;
    return axios.post(url, { body: { q: JSON.stringify(query)}});
};