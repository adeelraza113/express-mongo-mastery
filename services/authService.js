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
    try {
        const { confirm_password, ...userToSave } = userData;

        const existingUser = await User.findOne({ email: userToSave.email });
        if (existingUser) {
            throw new AppError('Email already registered!', 400);
        }

        const newUser = await User.create(userToSave);

        const token = signToken(newUser._id);
        newUser.password = undefined;

        return { message: 'User registered successfully', token };
    } catch (error) {
        console.error("Register service error:", error.message || error);
        throw error;
    }
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
        return { message: 'Login successful', token };
    }
}

export default new AuthService();