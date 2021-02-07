import { headers } from './header';
import axios from 'axios';

export const getSingleTweetApi = async(id) => {
  var config = {
    method: 'get',
    url: 'https://api.twitter.com/1.1/statuses/show.json?id=' + id,
    headers: headers
  };
  try {
    const response = await axios.get(config.url, {headers: config.headers});
    return response
  }catch(err) {
    console.log(err)
    return err
  }
};

export const getSingleTweet = (id) => {
  const dataUrl = 'https://api.twitter.com/1.1/statuses/show.json?id=' + id;
  const url = '/api/getSingleTweet';
  const body = {
    dataUrl:  dataUrl
  }
  return axios.post(url, { body: body });
}
