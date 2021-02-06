import { headers } from './header';

export const likeTweetApi = (id) => {
  const config = {
    method: 'POST',
    headers: headers,
    redirect: 'follow'
  };
  fetch(`https://api.twitter.com/1.1/favorites/create.json?id=${id}`, config).then( response =>  {
	  console.log(response.data, 'response data on liking');
  })
  .catch(function (error) {
    console.log(error);
  });

}

