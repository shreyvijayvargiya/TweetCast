import {headers} from './header';
import axios from 'axios';

export const getTimelineApi = () => {
  var config = {
    method: 'get',
    url: `api/getTimeline`,
    headers: { }
  };

  return axios(config);
};

export const getTimeline = () => {
  var config = {
    method: 'get',
    url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
    headers: { 
      'Authorization': 'OAuth oauth_consumer_key="KFhRrUOgwJN6DZswK3JmLLAPh",oauth_token="2567443994-mgLJsYk2LH5MB0zIrV5KqIzuPoBcha76CpOCE8j",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1612698356",oauth_nonce="TEdbTlhx3M1",oauth_version="1.0",oauth_signature="ZtkW2gG9zg%2BMZAINuXpIUaNUpXE%3D"', 
      'Cookie': 'personalization_id="v1_pwyPY+0T59dt6PGVVcsBcA=="; guest_id=v1%3A161073722487533724; lang=en'
    }
  };
  
  return axios(config).then(function (response) {
    if(response){
      return response.data
    }
  })
  .catch(function (error) {
    if(error){
      return null
    }
  });
  
}