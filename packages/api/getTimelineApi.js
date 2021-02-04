var axios = require('axios');
import { headers } from './header';

var config = {
  method: 'get',
  url: 'https://api.twitter.com/1.1/st\atuses/home_timeline.json',
  headers: headers
};

export const getTimelineApi = axios(config)
.then(function (response) {
  return response.data;
})
.catch(function (error) {
  console.log(error);
  return null;
});
