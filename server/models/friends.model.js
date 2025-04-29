import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    isFriend: {
        type: Boolean,
        default: false // false = request sent, true = friends
    },
    status: {
        type: String,
        enum: ["sent", "pending", "accepted", "declined", "blocked"],
        default: "pending"
    }
},
    { timestamps: true });

const FriendReqModel = mongoose.model('Friendreq', friendSchema);
export default FriendReqModel;
