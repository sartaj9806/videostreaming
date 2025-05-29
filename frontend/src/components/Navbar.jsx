import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { VideoContext } from '../context/VideoContext';

const Navbar = () => {
    const { token } = useContext(VideoContext);

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white fixed top-0 w-full z-50 shadow-md">
            {/* Logo / Title */}
            <Link to="/" className="text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition duration-200">
                🎬 Boom Video
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6 text-sm font-medium">
                {token ? (
                    <Link to="/profile" className="hover:text-blue-400 transition duration-200">
                        Profile
                    </Link>
                ) : (
                    <Link to="/login" className="hover:text-blue-400 transition duration-200">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
