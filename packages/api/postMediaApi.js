

export const postMediaOnTwitterApi = (file) => {
    const formData = new FormData();
    formData.append(`image/${file.type}`, file, file.name);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "OAuth oauth_consumer_key=\"tBhkYzwVodzWg2GbO82KOPv40\",oauth_token=\"2567443994-Fv9AkncVVZIWekAGlM5xv315hLJgvpN0sK1zCJn\",oauth_signature_method=\"HMAC-SHA1\",oauth_timestamp=\"1612505486\",oauth_nonce=\"K5Md7usoTEf\",oauth_version=\"1.0\",oauth_signature=\"2b0RkpgrJcAyVBD0zEV7J6dRsk0%3D\"");
    myHeaders.append("Cookie", "personalization_id=\"v1_pwyPY+0T59dt6PGVVcsBcA==\"; guest_id=v1%3A161073722487533724");
    const config = {
        method: 'POST',
        headers: myHeaders,
        body : formData,
        redirect: 'follow'
    };
    
    fetch(`https://upload.twitter.com/1.1/media/upload.json?media_category=${file.name}`, config)
    .then(response =>  {
      return response.text();
    })
    .then( result =>  console.log(result))
    .catch(function (error) {
      console.log(error);
    });
};



