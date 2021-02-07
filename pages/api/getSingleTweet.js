const Twitter = require('twitter');

const client = new Twitter({
    consumer_key: process.env.consumerKey,
    consumer_secret: process.env.consumerSecret,
    access_token_key: process.env.acessToken,
    access_token_secret: process.env.tokenSecret
});

module.exports = async(req, res) => {
    let responseObject = {
        status: "",
        message: "",
        data: [],
    };
    try {
        const parsedBody = req.body;
        function clientCallback() {
            return new Promise((resolve, reject) => {
                client.get(parsedBody.body.dataUrl, (error, data) => {
                    if(error) reject(error)
                    resolve(data)       
                });
            })
        };
        const res = await clientCallback();
        responseObject.data = res;
        res.json({body: responseObject });
    }catch(err) {
        res.send(err)
    }
}