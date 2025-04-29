import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    }
}, { _id: false });

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [memberSchema],
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Message'
    }],
    groupImage: {
        type: String,
    }
}, { timestamps: true });

const ChatModel = mongoose.model('Chat', chatSchema);

export default ChatModel;
