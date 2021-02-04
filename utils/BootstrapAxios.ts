import { configure } from 'axios-hooks'
import Axios from 'axios'
import { getGlobalState, setGlobalError } from '../state';

const axiosInstance = Axios.create({ baseURL: 'http://18.130.151.94/api' })

axiosInstance.interceptors.request.use(
  config => {
    const state = getGlobalState()

    let Auth = undefined

    if (state.sessionToken) {
      Auth = `Bearer ${state.sessionToken}`;
    }

    const customeHeaders = {
      Authorization: Auth,
      Accept: 'application/json'
    }
    config.headers = customeHeaders

    return config;
  }
);
axiosInstance.interceptors.response.use(
  config => {
    return config;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      setGlobalError(error.response.data.error);
      if (error.response.status === 401) {
        //dispatchGlobalState({ type: 'logout' });
      }
      console.log('error.response');
      console.log(error.response.headers);
      console.log(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      setGlobalError('we  could not connect to the server.');
      console.log('error.request');
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Something happened in setting up the request that triggered an Error');
      console.log(error.message);
      console.log('error.message');
    }
    throw error;
  }
);

configure({ axios: axiosInstance, cache: false })