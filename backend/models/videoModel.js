import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    type: {
        type: String,
        enum: ['short', 'long'],
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    videoPath: String,
    videoURL: String,
    price: { type: Number, default: 0 },
    createAt: {
        type: Date,
        default: Date.now,
    },
    comments: {
        type: Array
    }

})

const videoModel = mongoose.model('Video', videoSchema)
export default videoModel;