var axios = require('axios');

var config = {
  method: 'post',
  url: 'https://api.twitter.com/1.1/favorites/create.json?id=1355793213454336006',
  headers: { 
    'Authorization': 'OAuth oauth_consumer_key="tBhkYzwVodzWg2GbO82KOPv40",oauth_token="2567443994-Fv9AkncVVZIWekAGlM5xv315hLJgvpN0sK1zCJn",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1612085683",oauth_nonce="4Bc5Tu8sshJ",oauth_version="1.0",oauth_signature="94Sd%2FHNXbdrdtYe4ouRGC6s3Nzc%3D"', 
    'Cookie': 'personalization_id="v1_pwyPY+0T59dt6PGVVcsBcA=="; guest_id=v1%3A161073722487533724; lang=en'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
