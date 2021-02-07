module.exports = async(req, res) => {

    const Twitter = require('twitter');

    const client = new Twitter({
        consumer_key: process.env.consumerKey,
        consumer_secret: process.env.consumerSecret,
        access_token_key: process.env.acessToken,
        access_token_secret: process.env.tokenSecret
    });
    const parsedBody = JSON.parse(req.body);
    const tweetId = parsedBody.id;
    
    const shootPromise = () => {
        return new Promise((resolve, reject) => {
            client.post('favorites/create.json' + tweetId, (error, tweets) => {
                if(error) {
                    console.log(error, 'error')
                    reject(error)
                }
                resolve(tweets)
            })
        })
    }

    const response = await shootPromise();
    console.log(response, 'response');
    res.send(response);
}