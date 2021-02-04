import { IncomingOptions } from 'use-http';
import { getGlobalState, setGlobalError } from '../state';

export const fetchOtions: IncomingOptions = {
    interceptors: {
        // every time we make an http request, this will run 1st before the request is made
        // url, path and route are supplied to the interceptor
        // request options can be modified and must be returned
        request: async ({ options }) => {
            const state = getGlobalState()

            const newOptions = {
                headers: {
                    Accept: 'application/json',
                }
            }

            if (state.sessionToken) {
                //@ts-expect-error
                newOptions.headers.Authorization = `Bearer ${state.sessionToken}`;
            }

            return { ...options, ...newOptions };
        },
        // every time we make an http request, before getting the response back, this will run
        response: async ({ response }) => {
            if (!response.ok) {
                // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    setGlobalError(response.data.message);
                    if (response.status === 401) {
                        //dispatchGlobalState({ type: 'logout' });
                    }
                    //console.log('error.response');
                    //console.log(response.data.message);
                throw Error(response.data.message)
            }
            return response
        }
    },
}