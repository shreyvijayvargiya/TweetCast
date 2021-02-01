var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
  headers: { 
    'Authorization': 'OAuth oauth_consumer_key="tBhkYzwVodzWg2GbO82KOPv40",oauth_token="2567443994-Fv9AkncVVZIWekAGlM5xv315hLJgvpN0sK1zCJn",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1612079113",oauth_nonce="1kCrX4sXoJ7",oauth_version="1.0",oauth_signature="57N4LPv2nQivrYAvPHodCGaCyHQ%3D"', 
    'Cookie': 'personalization_id="v1_pwyPY+0T59dt6PGVVcsBcA=="; guest_id=v1%3A161073722487533724; lang=en'
  }
};

export const getTimelineApi = axios(config)
.then(function (response) {
  return response.data;
})
.catch(function (error) {
  console.log(error);
  return null;
});
