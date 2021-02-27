import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore } from 'react-hooks-global-state';
import Geolocation from 'react-native-geolocation-service';
//@ts-expect-error
import GPSState from 'react-native-gps-state'
import {checkMultiple, request, PERMISSIONS} from 'react-native-permissions';
import { Platform } from 'react-native';

type InitialState = {
  sessionToken: null | string,
  error: null | string,
  lat: null | number,
  long: null | number,
  gpsDisabled: boolean | null,
}

const initialState: InitialState = {
  sessionToken: null,
  error: null,
  lat: null,
  long: null,
  gpsDisabled: null,
};
 
const reducer = (state: Partial<InitialState>, action: { type: string, state: Partial<InitialState> }) => {
  switch (action.type) {
    case 'sessionToken': return { ...state, sessionToken: action.state?.sessionToken };
    case 'setError': return { ...state, error: action.state?.error };
    case 'logout': return { ...state, sessionToken: null };
    case 'location': return { ...state, lat: action.state.lat, long: action.state.long };
    case 'gpsStatus': return { ...state, gpsDisabled: action.state.gpsDisabled };
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

export const logout = () => {
  dispatch({ type: 'logout', state: {} })
  AsyncStorage.removeItem('sessionToken')
}

export const saveScannedCode = async (newCode: string) => {
  const scannedCodeString = await AsyncStorage.getItem('scannedCodes')
  let scannedCodes = []
  if (scannedCodeString) {
    scannedCodes = JSON.parse(scannedCodeString)
  }
  
  const found = scannedCodes.find((c: string) => c == newCode)

  if (!found) {
    scannedCodes.push(newCode)
    return AsyncStorage.setItem('scannedCodes', JSON.stringify(scannedCodes))
  } 
  return Promise.resolve()
}

export const codeIsSave = async (code: string) => {
  const scannedCodeString = await AsyncStorage.getItem('scannedCodes')
  let scannedCodes = []
  if (scannedCodeString) {
    scannedCodes = JSON.parse(scannedCodeString)
  }

  const found = scannedCodes.find((c: string) => c == code)

  if (!found) {
    return false
  } 
  return true
}

let clockStarted: boolean | NodeJS.Timeout = false
export const startClearCodeTracking = () => {
  if (clockStarted != false) return
  console.log("starting clearing clock")

  const minutes = 10

  clockStarted = setInterval(() => {
    console.log("Clearing scannedCodes")
    AsyncStorage.removeItem('scannedCodes')
  }, 60000 * minutes)
}

export const updateUserLocation = () => {
  Geolocation.getCurrentPosition(
    (position) => {
      dispatch({ type: 'location', state: { lat: position.coords.latitude, long: position.coords.longitude } })
    },
    (error) => {
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
}

export const setGpsIsDisabled = (is: boolean | null) => {
  dispatch({ type: 'gpsStatus', state: { gpsDisabled: is } })
}

export const showDisableLocationMessage = () => {
  setGpsIsDisabled(null)

  return GPSState.getStatus()
  .then((status: number)=> {
    switch(status){
      case GPSState.NOT_DETERMINED:
        console.log("NOT_DETERMINED")
        setGpsIsDisabled(true)
      break;
      case GPSState.RESTRICTED:
        console.log("RESTRICTED")
        setGpsIsDisabled(true)
      break;
      case GPSState.DENIED:
        console.log("DENIED")
        setGpsIsDisabled(true)
      break;
      case GPSState.AUTHORIZED_ALWAYS:
        console.log("AUTHORIZED_ALWAYS")
        setGpsIsDisabled(false)
      break;
      case GPSState.AUTHORIZED_WHENINUSE:
        console.log("AUTHORIZED_WHENINUSE")
        setGpsIsDisabled(false)
        break;
      default:
        setGpsIsDisabled(true)
    }
  })
}

export const requestLocationPermission = () => {
  checkMultiple([PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION])
  .then((statuses) => {
    if (Platform.OS == "ios" && statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] != "granted") {
      return request(PERMISSIONS.IOS.LOCATION_ALWAYS)
    }

    if (Platform.OS == "android" && statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] != "granted") {
      return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    }
  })
  .then(() => {
    showDisableLocationMessage()
  })
}

AsyncStorage.getItem('sessionToken')
.then((val) => {
  if (val) {
    setSessionToken(val)
  }
})

