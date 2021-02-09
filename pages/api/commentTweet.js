module.exports = async(req, res) => {

    const Twitter = require('twitter');

    const client = new Twitter({
        consumer_key: process.env.consumerKey,
        consumer_secret: process.env.consumerSecret,
        access_token_key: process.env.acessToken,
        access_token_secret: process.env.tokenSecret
    });
    const parsedBody = req.body.body;
    const message = JSON.parse(parsedBody.message);
    const username = JSON.parse(parsedBody.username);
    const in_reply_to_status_id = JSON.parse(parsedBody.id);

    const shootPromise = () => {
        return new Promise((resolve, reject) => {
            client.post('statuses/update' , { status: `@${username} ${message}`, in_reply_to_status_id: in_reply_to_status_id }, (error, tweets) => {
                if(error) {
                    console.log(error, 'error')
                    reject(error[0].message)
                }
                resolve(tweets)
            })
        })
    }

    const response = await shootPromise();
    res.json({ data: response });
}