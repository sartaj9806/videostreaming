import React, { useContext, useState, useEffect } from 'react';
import { VideoContext } from '../context/VideoContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreatorName from '../components/CreatorName';
import VideoPurchase from '../components/VideoPurchase';

// This is showing all videos from the backend show in card form
const Video = () => {
    const { backendUrl, token, user, setUser } = useContext(VideoContext);
    const [videos, setVideos] = useState([]);
    const [showPurchase, setShowPurchase] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const navigate = useNavigate();

    // Fetch All videos
    const fetchLongVideos = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/video/long`);
            if (data.success) {
                setVideos(data.videos);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching long videos:', error);
            toast.error('Error fetching long videos.');
        }
    };

    useEffect(() => {
        fetchLongVideos();
    }, [backendUrl]);

    // Check video is purchased or not
    const checkVideoPurchasedOrNot = (isPurchased, videoObj) => {
        if (isPurchased) {
            navigate(`/video/${videoObj._id}`);
        } else {
            setSelectedVideo(videoObj);
            setShowPurchase(true);
        }
    };

    // If video is not purchased, it will purchase video
    const handleConfirmPurchase = async () => {
        if (!selectedVideo) return;
        try {
            // purchasing from backend side
            const { data } = await axios.post(`${backendUrl}/api/video/purchased/${selectedVideo._id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            if (data.success) {
                toast.success('Video purchased successfully!');
                setUser((prev) => ({ ...prev, parchasedVideo: [...prev.parchasedVideo, selectedVideo._id], }));
                setShowPurchase(false);
            } else {
                toast.error(data.message || 'Purchase failed');
            }
        } catch (err) {
            toast.error('Error while purchasing');
            console.error(err);
        }
    };

    return (
        <div className="p-6 space-y-8 relative">
            <h1 className="text-2xl font-bold text-gray-800">🎬 Long Videos</h1>

            {/* Purchase box open here */}
            {showPurchase && selectedVideo && (
                <VideoPurchase
                    video={selectedVideo}
                    onClose={() => {
                        setShowPurchase(false);
                        setSelectedVideo(null);
                    }}
                    onConfirm={handleConfirmPurchase}
                />
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => {
                    const ytMatch = video.videoURL?.split('v=')[1];
                    const thumbnail = `https://img.youtube.com/vi/${ytMatch}/mqdefault.jpg`;

                    const isPurchased = user.parchasedVideo?.includes(video._id);

                    return (
                        <div key={video._id} className="bg-white rounded-lg shadow p-4">
                            <div
                                onClick={() => checkVideoPurchasedOrNot(isPurchased, video)}
                                className="cursor-pointer"
                            >
                                <img
                                    src={thumbnail}
                                    alt={video.title}
                                    className="rounded w-full aspect-video object-cover mb-3"
                                />
                                <h2 className="text-lg font-semibold">{video.title}</h2>
                                <p className="text-sm text-gray-500 mb-2">
                                    <CreatorName creatorId={video.creator} />
                                </p>
                                <p className="text-sm text-gray-600">{video.description}</p>
                                <p
                                    className={`mt-1 font-medium ${video.price > 0
                                        ? isPurchased
                                            ? 'text-blue-600'
                                            : 'text-green-600'
                                        : 'text-blue-500'
                                        }`}
                                >
                                    {video.price > 0
                                        ? isPurchased
                                            ? 'Watch'
                                            : `₹${video.price}`
                                        : 'Free'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Video;
