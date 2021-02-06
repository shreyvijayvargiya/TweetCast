import { headers } from './header';

export const getSingleTweetApi = () => {
  var config = {
    method: 'POST',
    headers: headers,
    redirect: 'follow'
  };
  fetch("https://api.twitter.com/1.1/statuses/home_timeline.json", config)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};
