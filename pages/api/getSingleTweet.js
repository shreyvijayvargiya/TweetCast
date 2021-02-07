const Twitter = require('twitter');

const client = new Twitter({
    consumer_key: process.env.consumerKey,
    consumer_secret: process.env.consumerSecret,
    access_token_key: process.env.acessToken,
    access_token_secret: process.env.tokenSecret
});

module.exports = async(req, res) => {
    let response = {
        data: [],
        status: null,
        message: null,
        error: false
    }
    try {
        const parsedBody = req.body;
        function clientCallback() {
            return new Promise((resolve, reject) => {
                client.get(parsedBody.body.dataUrl, (error, data) => {
                    if(error) {
                        response.error= true;
                        response.status = false;
                        response.message = 'Error in fetching commented tweet, please try again';
                    }
                    response.status = true;
                    response.data = data;            
                });
            })
        };
        const res = await clientCallback();
        console.log(res, 'res');
        res.send(response);
    }catch(err) {
        res.send(err)
    }
}