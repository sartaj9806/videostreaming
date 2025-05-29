// components/VideoPurchase.jsx
import React from 'react';
import { IoMdClose } from 'react-icons/io';

const VideoPurchase = ({ onClose, video, onConfirm }) => {
  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">Buy this video</h2>
        <p className="text-gray-600 mb-4">{video?.title}</p>
        <p className="text-lg font-medium text-green-600 mb-6">Price: ₹{video?.price}</p>

        <button
          onClick={onConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
        >
          Confirm Purchase
        </button>
      </div>
    </div>
  );
};

export default VideoPurchase;