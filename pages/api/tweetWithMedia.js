const bird = require('tweets.js')
const bot = new bird.tweet({
    consumer_key: process.env.consumerKey,
    consumer_secret: process.env.consumerSecret,
    access_token: process.env.acessToken,
    access_token_secret: process.env.tokenSecret
});

module.exports = async (req, res) =>  {
    
    const parsedBody = JSON.parse(req.body);
    const options = {
        tweet_message: parsedBody.tweet_message,
        alt_text: parsedBody.alt_text
    };
    res.send(bot.uploadMedia(parsedBody.fileUrl, options));
};
