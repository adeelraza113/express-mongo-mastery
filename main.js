import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { initSocket } from './config/socket.js';
import { errorHandler } from './config/errorHandler.js';
import authRoutes from './routes/authRoutes.js';



dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
initSocket(server);


app.use(helmet());
app.use(cors({ origin: '*' })); 

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: { status: 'fail', message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', limiter);
app.use(mongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(errorHandler);



app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "success", message: "Server is up and running!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});