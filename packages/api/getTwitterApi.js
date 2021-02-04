import axios from 'axios';
import FormData from 'form-data';
import { headers } from './header';

var data = new FormData();

var config = {
  method: 'get',
  url: 'https://api.twitter.com/1.1/search/tweets.json?q=covid-19&result_type=recent&count=5',
  headers: headers,
  data : data
};

export const searchTweetsApi = axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

