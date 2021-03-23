

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
        const screen_name = JSON.parse(req.body.body);
        
        const shootPromise = () => {
            return new Promise((resolve, reject) => {
                client.get('users/show.json', { screen_name: screen_name },(error, tweets, response) => {
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