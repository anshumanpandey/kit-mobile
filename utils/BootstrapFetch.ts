import { IncomingOptions } from 'use-http';
import { getGlobalState, logout, setGlobalError } from '../state';

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
                    'Content-Type': 'multipart/form-data'
                }
            }

            if (state.sessionToken) {
                //@ts-expect-error
                newOptions.headers.Authorization = `Bearer ${state.sessionToken}`;
            }

            const req = { ...options, ...newOptions }

            console.log({ req })

            return req;
        },
        // every time we make an http request, before getting the response back, this will run
        response: async ({ response }) => {
            console.log("cvccccccccccccccccccc");
            console.log({ response });

            if (!response.ok) {
                // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    setGlobalError(response.data.message);
                    if (response.status === 401) {
                        //dispatchGlobalState({ type: 'logout' });
                        logout()
                    }
                    //console.log('error.response');
                throw Error(response.data.message)
            }
            return response
        }
    },
}