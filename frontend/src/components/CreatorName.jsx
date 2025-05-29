import React, { useContext, useEffect, useState } from 'react'
import { VideoContext } from '../context/VideoContext'
import axios from 'axios'

// This is return creatorName
const CreatorName = ({ creatorId }) => {

    const { backendUrl } = useContext(VideoContext)
    const [name, setName] = useState('')

    useEffect(() => {
        const fetchCreatorName = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/user/creator/${creatorId}`)
                setName(data.user.name)
            } catch (error) {
                console.error('Error fetching creator name:', error);
            }
        }

        fetchCreatorName();

    }, [creatorId, backendUrl])

    return (
        <span>
            {name}
        </span>
    )
}

export default CreatorName
