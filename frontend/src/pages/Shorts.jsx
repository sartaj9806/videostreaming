import React, { useContext, useEffect } from 'react';
import { VideoContext } from '../context/VideoContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// This is used, if someone click short button then It will redirect short page with short video id
const Shorts = () => {
    const { backendUrl } = useContext(VideoContext);

    const navigate = useNavigate();

    // Fetch short videos when component mounts
    useEffect(() => {
        const fetchShortVideo = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/video/shorts`);
                if (data.success && data.videos.length > 0) {
                    navigate(`/shorts/${data.videos[0]._id}`);
                }
            } catch (error) {
                console.error('Failed to fetch short videos:', error);
            }
        };

        fetchShortVideo();
    }, [backendUrl]);

    return null; // Render nothing
};

export default Shorts;
