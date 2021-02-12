import axios from 'axios';

export const getUserProfile = (screen_name) => {
    const url = `api/getUserProfile`;
    return axios.post(url, { body: JSON.stringify(screen_name )});
  }
  