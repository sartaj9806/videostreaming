import express from 'express';
import upload from '../middleware/multer.js';
import { addComment, getLongVideoById, getLongVideos, getShortVideoInfo, getShortVideos, streamShortVideo, videoPurchased, vidoeUpload } from '../controller/videoController.js';
import { authenticate } from '../middleware/auth.js';
import { isVideoPurchased } from '../middleware/isVideoPurchased.js';

const videoRouter = express.Router();

videoRouter.post('/upload', authenticate, upload.single('video'), vidoeUpload) // For video Uploading

videoRouter.get('/shorts', getShortVideos); // This route for getAllShortVideo
videoRouter.get('/shorts/:videoId', streamShortVideo);  // This route is streaming one video with the videoId
videoRouter.get('/short-video-info/:videoId', getShortVideoInfo) // This route is showing videoInfo

videoRouter.get('/long', getLongVideos) // List all video
videoRouter.get('/long/:videoId', authenticate, isVideoPurchased, getLongVideoById) // Play video with the ID

videoRouter.post('/purchased/:videoId', authenticate, videoPurchased) // For video Purchasing

videoRouter.post('/comment/:videoId', authenticate, isVideoPurchased, addComment) // For add comment into video


export default videoRouter