import React, { useContext, useState } from 'react';
import VideoUpload from '../components/VideoUpload';
import { FiUploadCloud, FiLogOut } from 'react-icons/fi';
import { FaWallet } from 'react-icons/fa';
import { VideoContext } from '../context/VideoContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const [showVideoUploader, setShowVideoUploader] = useState(false); // This is for toggle upload popup
  const { setToken, user, } = useContext(VideoContext)



  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setToken(null); // Clear token in context
    navigate('/login'); // Redirect to login page
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-28 px-4 relative">

      <h1 className="text-3xl font-bold mb-6">👤 Profile Dashboard</h1>

      {/* Upload Modal */}
      {showVideoUploader && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
          <VideoUpload setShowVideoUploader={setShowVideoUploader} />
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md space-y-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-semibold">{user.name}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-semibold">{user.email}</p>
        </div>

        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <FaWallet className="text-xl" />
            ₹{user.balance}.00
          </div>
          <span className="text-sm text-gray-500">Wallet Balance</span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition duration-300 text-white text-sm font-semibold rounded-full px-5 py-2 shadow-md flex items-center gap-2"
          >
            <FiLogOut />
            Logout
          </button>

          <button
            onClick={() => setShowVideoUploader(true)}
            className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white text-sm font-semibold rounded-full px-5 py-2 shadow-md flex items-center gap-2"
          >
            <FiUploadCloud />
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
