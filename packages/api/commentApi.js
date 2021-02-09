import axios from 'axios';

export const postCommentMethod = (id, message, username, in_reply_to_status_id) => {
    const url = `${process.env.prodDomain}/api/commentTweet`;
    return axios.post(url, { body: { id: id, message: JSON.stringify(message), username: username, in_reply_to_status_id: JSON.stringify(in_reply_to_status_id) }});
}