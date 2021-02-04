import axios from 'axios';
import { headers } from './header';

export const postMediaOnTwitterApi = (file) => {
    const formData = new FormData();
    formData.append(`image/${file.type}`, file, file.name);
   
    var config = {
        method: 'post',
        url: `https://upload.twitter.com/1.1/media/upload.json?media_category=${file.name}`,
        headers: headers,
        data : formData.getAll(`image/${file.type}`)[0]
    };
    
    axios(config)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};


