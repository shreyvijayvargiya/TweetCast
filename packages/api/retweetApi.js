export const retweetMethod = (id) => {
    const url = 'http://localhost:3000/api/retweet';
    const config = {
      method: 'POST',
      body: JSON.stringify(id)
    };
    return fetch(url, config);
}

