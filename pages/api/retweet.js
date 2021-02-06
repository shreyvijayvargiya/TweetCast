module.exports = (req, res) => {

    const Twitter = require('twitter');

    const client = new Twitter({
        consumer_key: process.env.consumerKey,
        consumer_secret: process.env.consumerSecret,
        access_token_key: process.env.acessToken,
        access_token_secret: process.env.tokenSecret
    });
    const parsedBody = JSON.parse(req.body);

    var tweetId = parsedBody.id;
    const response = client.post('statuses/retweet/' + tweetId)
    res.send(response);
}