

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

        const cbFunction = (error, tweets) => {
            return new Promise((resolve, reject) => {
                resolve(tweets)
                reject(error)
        })};

        await client.get('statuses/home_timeline.json', cbFunction().then(tweets => {
            console.log('promise')
            responseObject.data = tweets;
            responseObject.status = true;
            responseObject.message = 'Tweet fetched successfully';
        }));
        console.log('response')
        res.send(responseObject);
    }catch(e) {
        res.send(e);
    }
}