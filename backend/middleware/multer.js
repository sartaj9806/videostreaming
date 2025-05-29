import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}


// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

//  file filter allowing only .mp4 files
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.mp4') {
        return cb(new Error('Only .mp4 files are allowed'), false)
    }

    cb(null, true)
}

// Middleware for handling file uploads using multer
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter,
})

export default upload;