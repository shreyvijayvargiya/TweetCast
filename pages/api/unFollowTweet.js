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
        const user_id = JSON.parse(req.body.body.user_id);
        console.log(user_id)
        const shootPromise = () => {
            return new Promise((resolve, reject) => {
                client.post("friendships/destroy.json", { user_id: user_id } , (error, tweets, response) => {
                    if(error) reject(error)
                    resolve(tweets)
                })
            })
        };
        const response = await shootPromise();
        responseObject.data = response;
        console.log(response, 'rjfnr')
        res.json({
            body: responseObject,
        });
    }catch(e) {
        console.log(e, 'error')
        res.send(e);
    }
}