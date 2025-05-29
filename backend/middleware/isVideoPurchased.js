import userModel from "../models/userModel.js";
import videoModel from "../models/videoModel.js";




export const isVideoPurchased = async (req, res, next) => {

    // Fetch user Id and video Id
    const { id } = req.user;
    const { videoId } = req.params;

    try {

        // fetch user info from the DB
        const user = await userModel.findById(id)
        if (!user) return res.json({ success: false, message: 'User does not exist' })

        // Fetch video info from the DB
        const video = await videoModel.findById(videoId);
        if (!video) return res.json({ success: false, message: 'Video deos not exists' })

        // check user parchased or not the video
        const isPurchased = user.parchasedVideo.includes(video._id);

        // if user has not purchased video then return this 
        if (!isPurchased) {
            return res.json({ success: false, message: 'Video has not been purchased please purchased video' })
        }

        // If user has purchased video then go to next()
        next();

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: 'Video Is not purchased' })
    }
}