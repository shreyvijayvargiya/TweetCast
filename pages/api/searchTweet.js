

module.exports = async (req, res) => {
    try {
        const Twitter = require('twitter');
        
        const client = new Twitter({
            consumer_key: process.env.consumerKey,
            consumer_secret: process.env.consumerSecret,
            access_token_key: process.env.acessToken,
            access_token_secret: process.env.tokenSecret
        });
        let responseObject = {
            status: "",
            message: "",
            data: [],
        };
        const query = JSON.parse(req.body.body.q);
        const shootPromise = () => {
            return new Promise((resolve, reject) => {
                client.get('search/tweets.json', { q: query } , (error, tweets, response) => {
                    if(error) reject(error)
                    resolve(tweets)
                })
            })
        }

        const response = await shootPromise();
        responseObject.data = response;
        res.json({
            body: responseObject,
        });
    }catch(e) {
        res.send(e);
    }
}