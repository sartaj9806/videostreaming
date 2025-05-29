import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';


const Home = () => {
  const location = useLocation();

  const navigate = useNavigate();

  // This is for showing selected category like video, and Short
  const isActive = (path) =>
    location.pathname.includes(path) ? 'bg-blue-600 text-white' : 'text-gray-700';

  useEffect(() => {
    // Redirect to the video page if no specific path is provided
    if (location.pathname === '/') {
      navigate('/video');
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r pt-20 px-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">🎥 Dashboard</h2>
        <nav className="flex flex-col gap-3">
          <Link
            to="video"
            className={`py-2 px-4 rounded-md hover:bg-blue-100 transition ${isActive('video')}`}
          >
            All Videos
          </Link>
          <Link
            to="shorts"
            className={`py-2 px-4 rounded-md hover:bg-blue-100 transition ${isActive('shorts')}`}
          >
            Shorts
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-8 h-[100vh]  overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
