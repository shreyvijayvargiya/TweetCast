export const retweetApi = (id) => {
    const url = '/api/singleTweet';
    const body = { id: id };
    const config = {
        body: JSON.stringify(body),
        method: 'POST'
    }
    fetch(url, config).then((response) => { 
        return response 
    });
}