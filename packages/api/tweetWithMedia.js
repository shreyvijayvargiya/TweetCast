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
    const body = { message:message };
    const config = {
        body: JSON.stringify(body),
        method: 'POST'
    }
    fetch(url, config).then((response) => { 
        return response 
    });
}