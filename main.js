import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { initSocket } from './config/socket.js';
import { errorHandler } from './config/errorHandler.js';



dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
initSocket(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use(errorHandler);

app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));



app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "success", message: "Server is up and running!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});