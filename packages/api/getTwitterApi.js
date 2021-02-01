import axios from 'axios';
import FormData from 'form-data';

var data = new FormData();

var config = {
  method: 'get',
  url: 'https://api.twitter.com/1.1/search/tweets.json?q=covid-19&result_type=recent&count=5',
  headers: { 
    'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAB5kMAEAAAAAHaGX9wzP8YRzx%2BthJbk%2Fod8FKcE%3D3KYayUxWB73LXzq5UGpOMXfa2ZCeDKquL8MEHPXe1tsQ4COGyI', 
    'Cookie': 'personalization_id="v1_pwyPY+0T59dt6PGVVcsBcA=="; guest_id=v1%3A161073722487533724; lang=en', 
    // ...data.getHeaders()
  },
  data : data
};

export const searchTweetsApi = axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

