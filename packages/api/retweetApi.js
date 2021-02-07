import { headers } from './header';

export const retweetApi = async(id) => {
    const url = 'https://api.twitter.com/1.1/favorites/create.json?id=' + id;
    try {
        const response = await axios.get(url, { headers: headers});
        return response
    }catch(err) {
        console.log(err)
        return err
    }
}