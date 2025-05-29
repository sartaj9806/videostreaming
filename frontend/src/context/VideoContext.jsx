import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const VideoContext = createContext();


const VideoContextProvider = ({ children }) => {

    // this is backend URL
    const backendUrl = 'http://localhost:3000'


    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState('') // Store user Info
    const [shortVideo, setShortVideo] = useState('') // Store short single video
    const [shortCount, setShortCount] = useState(0) // set Count to short video Itreation


    // Set Token it will call after login user
    const setTokenHandler = () => {
        setToken(localStorage.getItem('token') || null);
    }

    // This is for fetch user Data fron the backend
    useEffect(() => {
        const fetchUserData = async () => {
            try {

                const { data } = await axios.get(`${backendUrl}/api/user/get-user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (data.success) {
                    setUser(data.user)
                } else {
                    toast.error(data.message)
                }

            } catch (error) {
                console.error(error)
            }
        }

        fetchUserData();

    }, [token])

    const value = {
        backendUrl,
        setTokenHandler, token, setToken,
        user, setUser,
        shortVideo, setShortVideo,
        shortCount, setShortCount,

    }

    return (
        <VideoContext.Provider value={value}>
            {children}
        </VideoContext.Provider>
    )
}

export default VideoContextProvider