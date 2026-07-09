import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        
        // 1. Check token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please login to get access.', 401));
        }

        // 2. Token Verification
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        // Grant access: User object ko request ke sath attach kar dein taa ke aage routes me use ho sake
        req.user = currentUser;
        next();
    } catch (error) {
        return next(new AppError('Invalid token or session expired!', 401));
    }
};