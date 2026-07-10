import ChatMessage from '../models/chatModel.js';

class ChatController {
    async getRoomHistory(req, res, next) {
        try {
            const { roomName } = req.params;
            const history = await ChatMessage.find({ room: roomName })
                .sort('createdAt')
                .limit(50);

            return res.status(200).json({
                status: "success",
                data: history
            });
        } catch (error) {
            next(error);
        }
    }
}
export default new ChatController();