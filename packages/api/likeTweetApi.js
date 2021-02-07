import { headers } from './header';
import axios from 'axios';

export const likeTweetApi = async(id) => {
  const url = 'https://api.twitter.com/1.1/favorites/create.json?id=' + id;
  try {
    return axios.post(url, { headers: headers });
  }catch(err) {
    console.log(err)
    return err
  }
};

export const likeTweetMethod = (id) => {
    const url = 'http://localhost:3000/api/likeTweet';
    const config = {
      method: 'POST',
      body: JSON.stringify(id)
    };
    return fetch(url, config);
}

