import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import videoModel from '../models/videoModel.js';
import userModel from '../models/userModel.js';

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// for uploading videos
export const vidoeUpload = async (req, res) => {

    console.log('Video upload request received');

    // export video data from request body
    const { title, description, type, url, price } = req.body;
    if (!title || !description || !type) {
        return res.json({ success: false, message: 'All fields are required.' })
    }

    try {

        // create a new video 
        const newVideo = new videoModel({
            title,
            description,
            type,
            creator: req.user.id, // This should be replaced with the actual user ID from the authenticated user

        })

        // Check the type of video and set the appropriate fields
        if (type === 'short') {
            if (!req.file) {
                return res.json({ success: false, message: 'Short-form video is required.' })
            }
            newVideo.videoPath = req.file.path;
        } else if (type === 'long') {
            if (!url) {
                return res.json({ success: false, message: 'Long-form video URL is required.' })
            }
            newVideo.videoURL = url;
            newVideo.price = price || 0;
        } else {
            return res.json({ success: false, message: 'Invalid video type. Must be either "short" or "long".' })
        }

        // Save the video to the database
        const video = await newVideo.save();

        // If video is saved successfully, respond with success message
        res.json({ success: true, message: 'Video uploaded successfully.' })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });

    }

}

// Get all short videos
export const getShortVideos = async (req, res) => {
    try {
        // Fetch All short Video and responsed to frontend Side
        const videos = await videoModel.find({ type: 'short' })
        res.json({ success: true, videos, });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Stream one short video at a time with video id
export const streamShortVideo = async (req, res) => {
    try {
        // Extract video id from url
        const { videoId } = req.params;

        // Fetch video info from Database
        const video = await videoModel.findById(videoId);
        if (!video || !video.videoPath) {
            return res.json({ success: false, message: 'Video not found' });
        }

        // create video url and join path
        // example E:\Websites Practice\Project\2 Online Video\backend\controller
        // path.join does go to one step back and add uploads\1748317554999-Vidoe (1).mp4
        // Example E:\Websites Practice\Project\2 Online Video\backend\  because of this '..'
        // Add E:\Websites Practice\Project\2 Online Video\backend\uploads\1748317554999-Vidoe (1).mp4
        const videoPath = path.join(__dirname, '..', video.videoPath.replace(/\\/g, '/'));

        // If file does not exist on this videoPath then return video file missing
        if (!fs.existsSync(videoPath)) {
            return res.json({ success: false, message: 'Video file missing on disk' });
        }

        // Its return metadata of file like size, birthtime and more.
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;

        // It is checking range from browser side
        const range = req.headers.range;
        if (!range) {
            return res.send({ success: false, message: 'Range header is required for video streaming', });
        }

        // Stream the video in chunks (2MB)
        const CHUNK_SIZE = 2 * 1024 * 1024;
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

        const contentLength = end - start + 1;

        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, headers);

        const stream = fs.createReadStream(videoPath, { start, end });
        stream.pipe(res);
    } catch (error) {
        console.error('Stream error:', error);
        res.json({ success: false, message: 'Video streaming failed' });
    }
};

// Get short video info
export const getShortVideoInfo = async (req, res) => {

    // Take videoId from the URL
    const { videoId } = req.params;

    try {

        // Fetch one video with videoId
        const video = await videoModel.findById(videoId);

        // fetch user info who uploaded this video
        const user = await userModel.findById(video.creator)

        // Send video info to fronted
        const shortInfo = {
            title: video.title,
            date: video.createAt,
            creatorName: user.name
        }

        res.json({ success: true, message: 'Short Info Fetch successfully', shortInfo })

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

// Get all long video for listing
export const getLongVideos = async (req, res) => {
    try {
        // Get Videos and send to frontend
        const videos = await videoModel.find({ type: 'long' }).sort({ createAt: -1 });
        res.json({ success: true, videos });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Play long video with the video ID
export const getLongVideoById = async (req, res) => {
    try {
        // take videoId from Url
        const { videoId } = req.params;

        // fetch video from DB with video id
        const video = await videoModel.findById(videoId);
        if (!video) {
            return res.json({ success: false, message: 'Video not found' });
        }

        res.json({ success: true, video });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error fetching long video by ID' });
    }
}

// video purchasing controller 
export const videoPurchased = async (req, res) => {
    // fetch id and video id both
    const { id } = req.user;
    const { videoId } = req.params;

    try {
        // fetch user info from the DB
        const user = await userModel.findById(id);
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        // fetch video form the db
        const video = await videoModel.findById(videoId);
        if (!video) {
            return res.json({ success: false, message: 'Video not found' })
        }

        // deduct amount from user wallet
        user.balance = user.balance - video.price;

        // Push video into user purchased section 
        user.parchasedVideo.push(videoId);

        // Save changes into DB
        await user.save();

        res.json({ success: true, message: 'Video Purchaed succsussfully' })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }

}

// Add comment on video
export const addComment = async (req, res) => {

    const { id } = req.user; // Take user id
    const { videoId } = req.params; // take video id
    const { name, comment } = req.body; // take data from frontend with req.body

    try {

        // Fetch Video ifrom the DB
        const video = await videoModel.findById(videoId)
        if (!video) return res.json({ success: false, message: 'Video not found' })

        // Create a object that wil store into video comment section 
        const commentObj = {
            userId: id,
            name,
            comment,
            date: Date.now(),
        }

        // push into video comment section
        video.comments.push(commentObj)

        // Save changes
        await video.save();

        res.json({ success: true, message: 'comments add successfully', commentObj })

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}