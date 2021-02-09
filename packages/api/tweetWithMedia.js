import axios from 'axios';

export const tweetWithMedia = (data) => {
    const url = `/api/tweetWithMedia`;
    
    const body = {
        fileUrl: data.fileUrl, tweet_message: data.tweetMessage, alt_text: "Tweet Image"
    };
    const config = {
        method: 'POST',
        body: JSON.stringify(body)
    }
    fetch(url,config).then((response) => console.log(response, 'response'))
}

export const singleTweetApi = (message) => {
    const url = '/api/singleTweet';
    const body = { message: JSON.stringify(message) };
    return axios.post(url, { body: body });
}