import React, { useContext, useEffect, useState } from 'react';
import { VideoContext } from '../context/VideoContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


// This for playing short videos
const ShortFeed = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const { backendUrl, shortVideo, setShortVideo, shortCount, setShortCount, } = useContext(VideoContext);
  const [shortInfo, setShortInfo] = useState('')

  // Fetch All short videos
  useEffect(() => {
    const fetchShortVideo = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/video/shorts`);
        if (data.success) {
          setShortVideo(data.videos);
          setShortCount(0);
        }
      } catch (error) {
        console.error('Error fetching shorts:', error);
      }
    };

    // Fetch only one short video and play
    const fetchShortInfo = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/video/short-video-info/${videoId}`)
        setShortInfo(data.shortInfo)
      } catch (error) {
        console.error(error)
      }
    }

    fetchShortInfo()
    fetchShortVideo();
  }, [backendUrl]);

  // This function is for next video
  const nextVideo = () => {
    if (shortCount + 1 < shortVideo.length) {
      const nextIndex = shortCount + 1;
      setShortCount(nextIndex);
      navigate(`/shorts/${shortVideo[nextIndex]._id}`);
    }
  };

  // This fuction is for previos video
  const prevVideo = () => {
    if (shortCount > 0) {
      const prevIndex = shortCount - 1;
      setShortCount(prevIndex);
      navigate(`/shorts/${shortVideo[prevIndex]._id}`);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-end  text-black px-4 pb-6">
      {/* Header section  */}
      <div className="text-center mb-2">
        <p className="text-lg font-semibold">🎬 Short Video</p>
        <p className="text-2xl font-bold text-black">{shortInfo.title}</p>
        <p className="text-sm text-black">Uploaded by {shortInfo.creatorName}</p>
        <p></p>
      </div>

      {/* Video Section  */}
      <div className="relative w-full max-w-md">
        <video
          className="rounded-lg shadow-lg w-full max-h-[70vh] object-cover"
          controls
          autoPlay
          muted
          src={`${backendUrl}/api/video/shorts/${videoId}`}
        ></video>

        {/* Button for next and previous */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevVideo}
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-white"
          >
            ⬅️ Previous
          </button>

          <button
            onClick={nextVideo}
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-white"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortFeed;
