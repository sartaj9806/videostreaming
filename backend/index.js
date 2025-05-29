import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRouter from './routes/userRoute.js';
import videoRouter from './routes/videoRoute.js';
import cors from 'cors';

// Importing necessary modules
const app = express()

// Load environment variables from .env file
dotenv.config()

// Use PORT from environment variables
const PORT = process.env.PORT;

// Middleware to enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json())




app.get('/', (req, res) => {
    res.send('Hello, World!')
})


// Importing routes 
app.use('/api/user', userRouter)
app.use('/api/video', videoRouter)


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
}) 