import mongoose from "mongoose";

const friendListSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    becameFriendsAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const FriendListModel = mongoose.model('FriendList', friendListSchema);
export default FriendListModel;
