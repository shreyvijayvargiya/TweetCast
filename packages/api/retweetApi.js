export const retweetMethod = (id) => {
    const url = `api/retweet`;
    const config = {
      method: 'POST',
      body: JSON.stringify(id)
    };
    return fetch(url, config);
}

