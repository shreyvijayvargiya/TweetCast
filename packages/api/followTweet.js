import axios from 'axios';

export const followUser = (user_id) => {
    const url = `api/followTweet`;
    return axios.post(url, { body: { user_id: JSON.stringify(user_id)}});
};
export const unFollowUser = (user_id) => {
    const url = `api/unFollowTweet`;
    return axios.post(url, { body: { user_id: JSON.stringify(user_id)}});
}
