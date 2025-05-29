import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VideoContext } from '../context/VideoContext';
import axios from 'axios';
import CreatorName from '../components/CreatorName';

// fetching one video and playing
const VideoPlayer = () => {
    const { videoId } = useParams();
    const { backendUrl, token, user } = useContext(VideoContext);

    const [video, setVideo] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const fetchVideo = async () => {
        try {
            
            const { data } = await axios.get(`${backendUrl}/api/video/long/${videoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (data.success) {
                setVideo(data.video);
                setComments(data.video.comments)
            } else {
                console.error(data.message || 'Failed to fetch video.');
            }
        } catch (error) {
            console.error('Error fetching video:', error);
        }
    };

    const handleCommentSubmit = async () => {
        if (!comment.trim()) return; // trim extra space and comment not empty then return 

        try {
            const { data } = await axios.post(`${backendUrl}/api/video/comment/${videoId}`, {
                name: user.name,
                comment: comment,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                setComment('')
                setComments(prev => [...prev, data.commentObj])
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        fetchVideo();
    }, [backendUrl, videoId]);

    
    const convertToEmbedUrl = (url) => {
        if (!url) return '';
        const newUrl = url.split('v=')[1];
        return `https://www.youtube.com/embed/${newUrl}?autoplay=1`;
    };

    if (!video) return <p className="p-10">Loading video...</p>;

    const formattedDate = new Date(video.createAt).toLocaleDateString().replaceAll('/', '-');

    const commentFormateDate = (date) => new Date(date).toLocaleTimeString().replaceAll('/', '-')

    return (
        <div className="pt-28 px-6 flex flex-col lg:flex-row gap-8">

            {/* Video Section */}
            <iframe
                width="100%"
                height="480"
                src={convertToEmbedUrl(video.videoURL)}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={video.title}
                className="rounded-lg w-full lg:w-[60%] aspect-video"
            ></iframe>

            <div className="flex-1">

                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{video.title}</h1>
                    <p className="text-gray-600 text-lg">By <CreatorName creatorId={video.creator} /></p>
                    <p className="text-gray-600 text-lg">Uploaded on: {formattedDate}</p>
                    <p className="text-gray-700 mt-4 text-base">{video.description}</p>
                </div>

                {/* Comment Section */}
                <div className="border-t pt-4">
                    <h2 className="text-xl font-semibold mb-2">Comments</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            className="border border-gray-300 rounded w-full px-4 py-2"
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Post
                        </button>
                    </div>

                    {comments.length > 0 ? (
                        <ul className="space-y-2">
                            {comments.map((c, idx) => (
                                <li key={idx} className="bg-gray-100 p-3 rounded">
                                    <p className="font-medium">{c.name} <span className="text-sm text-gray-500">({commentFormateDate(c.date)})</span></p>
                                    <p className="text-sm text-gray-700">{c.comment}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;