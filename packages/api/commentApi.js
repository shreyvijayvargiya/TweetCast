import axios from 'axios';

export const postCommentMethod = (id, message, username, in_reply_to_status_id) => {
    const url = `api/commentTweet`;
    return axios.post(url, { body: { id: JSON.stringify(id), message: JSON.stringify(message), username: JSON.stringify(username), in_reply_to_status_id: JSON.stringify(in_reply_to_status_id) }});
}