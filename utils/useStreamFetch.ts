import { useState } from "react"
import { getGlobalState, logout, setGlobalError } from "../state"
import { resetToLoginScreen } from "./NavigationUtils"

export default <T = any>() => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [data, setData] = useState<T | undefined>(undefined)


    const doFetch = (input: RequestInfo, init?: RequestInit) => {
        setLoading(true)
        const state = getGlobalState()

        const newOptions: RequestInit = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }
        if (state.sessionToken) {
            //@ts-expect-error
            newOptions.headers.Authorization = `Bearer ${state.sessionToken}`;
        }
        
        return fetch(`https://dashboard.kitgo.app/api${input}`, { ...init, ...newOptions })
        .then((response) => {
            if (!response.ok) {
                return response.json()
                .then(err => Promise.reject({ ...response, errorMessage: err }))
            }
            return response
        })
        .then((response) => response.json() as Promise<T>)
        .then((response) => {
            setLoading(false)
            setData(response)
            return response
        })
        .catch((response) => {
            console.log(response)
            setError(response)
            setGlobalError(response.errorMessage.message);
            if (response.status === 401) {
                logout()
                resetToLoginScreen()
            }
            setLoading(false)
            throw response
        })

        
    }

    return { loading, error, data, get: doFetch, doRequest: doFetch }
}