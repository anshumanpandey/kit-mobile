import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore } from 'react-hooks-global-state';

type InitialState = {
    sessionToken: null | string,
    error: null | string,
}

const initialState: InitialState = {
    sessionToken: null,
    error: null,
};
 
const reducer = (state: Partial<InitialState>, action: { type: string, state: Partial<InitialState> }) => {
  switch (action.type) {
    case 'sessionToken': return { ...state, sessionToken: action.state?.sessionToken };
    case 'setError': return { ...state, error: action.state?.error };
    default: return state;
  }
};
export const { dispatch, useGlobalState, getState: getGlobalState } = createStore(reducer, initialState);

export const setSessionToken = (sessionToken: string) => {
  dispatch({ type: 'sessionToken', state: { sessionToken } })
  AsyncStorage.setItem('sessionToken', sessionToken)
}

export const setGlobalError = (error: string | null) => {
    dispatch({ type: 'setError', state: { error } })
}

AsyncStorage.getItem('sessionToken')
.then((val) => {
  if (val) {
    setSessionToken(val)
  }
})

