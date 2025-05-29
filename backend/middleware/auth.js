import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {

    // Get the token from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.json({ success: false, message: 'Please Login Again' })
    }

    try {

        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // if token is valid, attach the user information to the request object
        req.user = decoded;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        return res.json({ success: false, message: 'Please Login Again' })
    }
}