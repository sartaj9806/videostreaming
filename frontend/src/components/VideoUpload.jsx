import React, { useContext, useState } from 'react';
import axios from 'axios';
import { VideoContext } from '../context/VideoContext';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const VideoUpload = ({ setShowVideoUploader }) => {
    const { backendUrl, token } = useContext(VideoContext);

    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [videoType, setVideoType] = useState('short');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoPrice, setVideoPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // create form data
        const formData = new FormData();
        formData.append('title', videoTitle);
        formData.append('description', videoDescription);
        formData.append('type', videoType);

        if (videoType === 'short') {
            if (!videoFile) return toast.error('Please upload a short-form .mp4 file.');
            formData.append('video', videoFile);
        } else if (videoType === 'long') {
            if (!videoUrl) return toast.error('Please enter a video URL.');
            formData.append('url', videoUrl);
            formData.append('price', videoPrice || 0);
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/video/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                toast.success(data.message)

                // Reset fields
                setVideoTitle('');
                setVideoDescription('');
                setVideoType('short');
                setVideoUrl('');
                setVideoFile(null);
                setVideoPrice('');
                setShowVideoUploader(false); // close the upload popup 
            } else {

                // If the response indicates a login issue, handle it
                if (data.message === 'Please Login Again') {
                    toast.error(data.message);
                    localStorage.removeItem('token'); // Clear token from local storage
                    navigate('/login') // Reload to redirect to login
                } else {
                    toast.error(data.message || 'Upload failed.');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50 overflow-y-auto px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mt-10 flex flex-col gap-4 relative"
            >
                {/* Close button */}
                <div
                    className="absolute top-2 right-2 cursor-pointer text-2xl text-gray-600 hover:text-red-500 transition"
                    onClick={() => setShowVideoUploader(false)}
                >
                    <IoMdClose />
                </div>

                <h1 className="text-2xl font-bold mb-4 text-center">Upload Video</h1>

                <input
                    onChange={(e) => setVideoTitle(e.target.value)}
                    value={videoTitle}
                    className="border text-base rounded-lg px-2 py-1"
                    type="text"
                    placeholder="Add video title here"
                    required
                />

                <textarea
                    onChange={(e) => setVideoDescription(e.target.value)}
                    value={videoDescription}
                    className="border text-base rounded-lg px-2 py-1"
                    placeholder="Add video description here"
                />

                <select
                    onChange={(e) => setVideoType(e.target.value)}
                    value={videoType}
                    className="border text-base rounded-lg px-2 py-1"
                >
                    <option value="short">Short</option>
                    <option value="long">Long</option>
                </select>

                {videoType === 'short' && (
                    <input
                        onChange={(e) => setVideoFile(e.target.files[0])}
                        className="border text-base rounded-lg px-2 py-1"
                        type="file"
                        accept="video/mp4"
                        required
                    />
                )}

                {videoType === 'long' && (
                    <>
                        <input
                            onChange={(e) => setVideoUrl(e.target.value)}
                            value={videoUrl}
                            className="border text-base rounded-lg px-2 py-1"
                            type="text"
                            placeholder="Add video URL here"
                            required
                        />
                        <input
                            onChange={(e) => setVideoPrice(e.target.value)}
                            value={videoPrice}
                            className="border text-base rounded-lg px-2 py-1"
                            type="number"
                            placeholder="Add video price (₹)"
                        />
                    </>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-gray-900 text-white text-base font-medium rounded-lg px-4 py-2 cursor-pointer transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                        }`}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    );
};

export default VideoUpload;
