// import axios from 'axios';
// import FormData from 'form-data';

// export const uploadImage = () => {
//     var data = new FormData();
//     const fs = require('fs');
//     data.append('media', fs.createReadStream('/Users/shreyvijayvargiya/Downloads/alexander-shatov-mr4JG4SYOF8-unsplash.jpg'));
    
//     var config = {
//       method: 'post',
//       url: 'https://upload.twitter.com/1.1/media/upload.json?media_category=tweet_image',
//       headers: { 
//         'Authorization': 'OAuth oauth_consumer_key="tBhkYzwVodzWg2GbO82KOPv40",oauth_token="2567443994-Fv9AkncVVZIWekAGlM5xv315hLJgvpN0sK1zCJn",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1612505486",oauth_nonce="K5Md7usoTEf",oauth_version="1.0",oauth_signature="2b0RkpgrJcAyVBD0zEV7J6dRsk0%3D"', 
//         'Cookie': 'personalization_id="v1_pwyPY+0T59dt6PGVVcsBcA=="; guest_id=v1%3A161073722487533724', 
//         ...data.getHeaders()
//       },
//       data : data
//     };
    
//     axios(config)
//     .then(function (response) {
//       console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }
