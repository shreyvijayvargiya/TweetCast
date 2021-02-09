
module.exports = async(req, res) => {
    const Twitter = require('twitter');
    
    const client = new Twitter({
        consumer_key: process.env.consumerKey,
        consumer_secret: process.env.consumerSecret,
        access_token_key: process.env.acessToken,
        access_token_secret: process.env.tokenSecret
    });
    const message = req.body.body.message;
    const shootPromise = () => {
        return new Promise((resolve, reject) => {
            client.post('statuses/update.json', { status: message } , (error, data) => {
                if(error) reject(error)
                resolve(data)       
            });
        })
    };
    const response = await shootPromise();
    res.send({ body: response });
}