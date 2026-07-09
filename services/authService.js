import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../config/errorHandler.js';


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

class AuthService {
    async register(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new AppError('Email already registered!', 400);
        }
        
        const newUser = await User.create(userData);
        const token = signToken(newUser._id);
        newUser.password = undefined;
        return { user: newUser, token };
    }

  
    async login(email, password) {
        if (!email || !password) {
            throw new AppError('Please provide email and password!', 400);
        }

        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new AppError('Incorrect email or password!', 401);
        }

        const token = signToken(user._id);
        user.password = undefined;
        return { user, token };
    }
}

export default new AuthService();