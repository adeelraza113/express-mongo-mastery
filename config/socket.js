import { Server } from 'socket.io';
import ChatMessage from '../models/chatModel.js';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Live Client Connected: ${socket.id}`);
        socket.on('join_room', (data) => {
            const { room, username } = data;
            socket.join(room); 
            console.log(`User [${username}] joined room: [${room}]`);
            socket.to(room).emit('user_joined', {
                message: `${username} has joined the chat.`
            });
        });

        socket.on('send_message', async (data) => {
            const { room, senderId, senderName, message } = data;
            try {
                const savedMessage = await ChatMessage.create({
                    room,
                    sender: senderId,
                    senderName,
                    message
                });
                io.to(room).emit('receive_message', savedMessage);   
            } catch (error) {
                console.error("Error saving chat message:", error.message);
            }
        });
        socket.on('disconnect', () => {
            console.log(`Client Disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};