import { headers } from './header';
import axios from 'axios';

export const getSingleTweetApi = (id) => {  
  var config = {
    method: 'get',
    url: `https://api.twitter.com/1.1/statuses/show.json?id=${id}`,
    headers: { 
      'Authorization': `Bearer ${process.env.bearerToken}`, 
      'Cookie': 'personalization_id="v1_pwyPY+0T59dt6PGVVcsBcA=="; guest_id=v1%3A161073722487533724; lang=en'
    }
  };
  
  return axios(config);

};

export const getSingleTweet = (id) => {
  const dataUrl = 'https://api.twitter.com/1.1/statuses/show.json?id=' + id;
  const url = `api/getSingleTweet`;
  const body = {
    dataUrl:  dataUrl
  }
  return axios.post(url, { body: body });
}
