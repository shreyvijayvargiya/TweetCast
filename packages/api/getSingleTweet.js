import axios from 'axios';

export const getSingleTweetApi = async (id) => {
    var config = {
        method: 'get',
        url: `https://api.twitter.com/1.1/statuses/show.json?id=${id}`,
        headers: { 
          'Authorization': 'OAuth oauth_consumer_key="tBhkYzwVodzWg2GbO82KOPv40",oauth_token="2567443994-Fv9AkncVVZIWekAGlM5xv315hLJgvpN0sK1zCJn",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1612274464",oauth_nonce="OVmb0oNldu6",oauth_version="1.0",oauth_signature="v57JAFUQKm9LlzIaU8po1nF3YJk%3D"', 
          'Cookie': 'personalization_id="v1_pwyPY+0T59dt6PGVVcsBcA=="; guest_id=v1%3A161073722487533724; lang=en'
        }
      };
    const response = await axios(config);
    return response.data;
};
