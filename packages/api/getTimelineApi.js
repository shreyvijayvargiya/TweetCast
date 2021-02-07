import {headers} from './header';
import axios from 'axios';

export const getTimelineApi = () => {
  const url = '/api/getTimeline';
  const config = {
    method: 'GET'
  };
  fetch(url, config).then(data => { console.log(data, 'data') });
};

export const getTimeline = () => {
  var config = {
    method: 'get',
    url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
    headers: { 
      'Authorization': 'OAuth oauth_consumer_key="KFhRrUOgwJN6DZswK3JmLLAPh",oauth_token="2567443994-eRKcEIqibJFXXQa2PTkVJKC92beE7Fl3O4OmXBR",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1612635930",oauth_nonce="qnG8rAelH5v",oauth_version="1.0",oauth_signature="1s0XGAALmyAjaExDjU4pH%2B5%2BqEc%3D"', 
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