import axios from 'axios';

export const getSingleTweetApi = (id) => {
    var config = {
        method: 'get',
        url: `https://api.twitter.com/1.1/statuses/show.json?id=${id}`,
        headers: { 
          'Authorization': 'OAuth oauth_consumer_key="tBhkYzwVodzWg2GbO82KOPv40",oauth_token="2567443994-Fv9AkncVVZIWekAGlM5xv315hLJgvpN0sK1zCJn",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1612214621",oauth_nonce="JkfByAearCS",oauth_version="1.0",oauth_signature="OXDPlJSN4e%2B3KWyx7AzMtKCvqYg%3D"', 
          'Cookie': 'personalization_id="v1_pwyPY+0T59dt6PGVVcsBcA=="; guest_id=v1%3A161073722487533724; lang=en'
        }
      };
    return axios(config).then((res) => { return res.data }).catch((error) => console.log(error));
};
