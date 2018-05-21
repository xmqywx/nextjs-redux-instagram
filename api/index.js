import axios from 'axios';
import querystring from 'querystring';

export const requestApiToken = code => {
  return axios
    .post(
      'https://api.instagram.com/oauth/access_token',
      querystring.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: 'https://murmuring-forest-94710.herokuapp.com/',
        code
      })
    )
    .catch(error => {
      return {
        status: error.response.status,
        data: error.response.data
      };
    });
};
