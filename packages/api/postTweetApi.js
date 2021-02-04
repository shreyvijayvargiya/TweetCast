var axios = require('axios');

export const postTweetApi = (data) => {
    
  let headers = { 
    'oauth_consumer_key': 'tBhkYzwVodzWg2GbO82KOPv40', 
    'oauth_consumer_secret': 'qUMt06sSGptrlW4bFhhsnRJcs09RJEbW0pasmplJpRPvHVPC47', 
    'oauth_token': '2567443994-Fv9AkncVVZIWekAGlM5xv315hLJgvpN0sK1zCJn', 
    'oauth_token_secret': '6KyXFFt7pjBHKDwdYJX47GBwl7ycccEukvlY1Q0T3tfzN', 
    'Authorization': 'OAuth oauth_consumer_key="tBhkYzwVodzWg2GbO82KOPv40",oauth_token="2567443994-Fv9AkncVVZIWekAGlM5xv315hLJgvpN0sK1zCJn",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1612417112",oauth_nonce="oJz3EhQRMsx",oauth_version="1.0",oauth_signature="tQEp5k2%2FpRFATNmVKWTqpCOoICs%3D"', 
    'Cookie': 'personalization_id="v1_pwyPY+0T59dt6PGVVcsBcA=="; guest_id=v1%3A161073722487533724'
  }
  let url;
  if(data.media){
    url = `https://api.twitter.com/1.1/statuses/update.json?status=${data.status}&media_ids=${data.media}`;
  }else{
    url = `https://api.twitter.com/1.1/statuses/update.json?status=${data.status}`;
  }
  const config = {
    method: 'post',
    url: url,
    headers: headers,
  }
  return axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}

