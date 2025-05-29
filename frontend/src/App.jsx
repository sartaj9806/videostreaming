import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { VideoContext } from './context/VideoContext';
import ShortFeed from './pages/ShortFeed';      // ✅ NEW
import Video from './pages/Video';
import VideoPlayer from './pages/VideoPlayer';
import Shorts from './pages/Shorts';

const App = () => {
  const { token } = useContext(VideoContext);

  return (
    <div>
      <Navbar />
      <ToastContainer />

      <Routes>
        <Route path='/' element={<Home />}>
          <Route path='video' element={<Video />} />
          <Route path='shorts' element={<Shorts />} />
          <Route path='shorts/:videoId' element={<ShortFeed />} />
        </Route>


        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={token ? <Profile /> : <Login />} />

        <Route path='/video/:videoId' element={<VideoPlayer />} />


      </Routes>
    </div>
  );
};

export default App;
