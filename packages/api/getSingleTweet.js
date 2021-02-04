import axios from 'axios';
import { headers } from './header';

export const getSingleTweetApi = async (id) => {
  var config = {
    method: 'get',
    url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
    headers: headers
  };
  const res = await axios(config);
  return res.data;
};
