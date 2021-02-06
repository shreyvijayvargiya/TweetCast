export const commentApi = (id, message) => {
    const url = '/api/commentTweet';
    const body = { id: id, message };
    const config = {
        body: JSON.stringify(body),
        method: 'POST'
    }
    fetch(url, config).then((response) => { 
        return response 
    });
}