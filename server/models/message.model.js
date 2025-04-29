import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    chat: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chat',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["sending", "sent", "seen"],
        default: "sending"
    }
}, { timestamps: true });
const messageModel = mongoose.model('Message', messageSchema)

export default messageModel