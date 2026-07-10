import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
        index: true 
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});


chatMessageSchema.index({ room: 1, createdAt: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;