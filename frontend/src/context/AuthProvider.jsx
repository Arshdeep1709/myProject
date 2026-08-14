import React, { createContext, useEffect, useState } from 'react'
import { toast } from "react-toastify";
import axios from "axios";

export const Authcontext = createContext()

const AuthProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    const [userData, setUserData] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false)

    const getAuthStatus = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/user/is-authenticated`, 
                { withCredentials: true }
            )
            if (data.success) {
                setLoggedIn(true)
                getUserProfile()
            }
            else {
                setLoggedIn(false)
            }
        } catch (error) {
            setLoggedIn(false)
        }
    }
    const getUserProfile = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/user/profile`,
                 { withCredentials: true }
                )
            if (data.success) {
                setUserData(data.userData)
                setLoggedIn(true)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            setUserData(null)
            setLoggedIn(false)
        }
    }
    useEffect(() => {
        getAuthStatus()
    }, [])

    const value = {
        backendUrl, userData, setUserData, loggedIn, setLoggedIn, getUserProfile
    }


    return (
        <div>
            <Authcontext.Provider value={value}>
                {children}
            </Authcontext.Provider>
        </div>
    )
}

export default AuthProvider