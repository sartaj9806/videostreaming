import express from 'express'
import { getFullUserData, getUserDetails, userLogin, userRegister } from '../controller/userController.js';
import { authenticate } from '../middleware/auth.js';

const userRouter = express.Router();

// import controller functions and define routes
userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)

userRouter.get('/creator/:userId', getUserDetails)
userRouter.get('/get-user', authenticate, getFullUserData)



export default userRouter;