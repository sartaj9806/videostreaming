import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const userRegister = async (req, res) => {

    // Extract user details from request body
    const { name, email, password } = req.body;

    // Validate user details
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'All fields are required.' })
    }

    try {

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });

        // If user exists, return an error message
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists with this email.' })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new user
        const newUser = new userModel({ name, email, password: hashedPassword })

        // Save the user to the database
        const user = await newUser.save();

        // Find the user by email to generate a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        // If user is created successfully, respond with success message
        res.json({ success: true, message: 'User registered successfully.', user, token })

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export const userLogin = async (req, res) => {

    // Extract email and password from request body
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'All fields are required.' });
    }

    try {

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User does not exist with this email.' })
        }

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.json({ success: false, message: 'Invalid password.' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        // If password is valid, respond with success message
        res.json({ success: true, message: 'User logged in successfully.', user, token })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export const getUserDetails = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.json({ success: false, message: 'User ID is required.' });
    }
    try {

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, user: { name: user.name } });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });

    }
}

export const getFullUserData = async (req, res) => {

    const { id } = req.user;

    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res.json({ success: false, message: 'User does not found' })
        }

        res.json({ success: true, message: 'User found successfully', user })
    } catch (error) {
        console.error(error)
        res.json({success : false, message : error.message})
    }
}