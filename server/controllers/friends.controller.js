import FriendListModel from "../models/friendList.model.js";
import FriendReqModel from "../models/friends.model.js";

export async function sendFriendReq(req, res) {
    try {
        const userid = req.userId;
        const { recipient } = req.body;

        if (!recipient) {
            return res.status(400).json({
                message: "Please enter your friend's ID",
                success: false,
                error: true
            });
        }
        if (recipient === userid) {
            return res.status(400).json({
                message: "You cannot send a friend request to yourself.",
                success: false,
                error: true
            });
        }


        const payload = {
            requester: userid,
            recipient,
            status: 'sent'
        };

        const friendRequest = new FriendReqModel(payload);
        const savedRequest = await friendRequest.save();

        return res.status(200).json({
            message: 'Friend request sent successfully.',
            error: false,
            success: true,
            data: savedRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Get all Friend Requests
export async function getAllByIDReq(req, res) {
    try {
        const userid = req.userId;

        if (!userid) {
            return res.status(400).json({
                message: "User ID missing.",
                success: false,
                error: true
            });
        }

        const friendRequests = await FriendReqModel.find({
            $or: [
                { requester: userid },
                { recipient: userid }
            ]
        })

        return res.status(200).json({
            message: 'Friend requests fetched successfully.',
            error: false,
            success: true,
            data: friendRequests
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function deleteReqById(req, res) {
    try {
        const userid = req.userId;
        const { recipient } = req.body;

        if (!recipient) {
            return res.status(400).json({
                message: "Recipient ID is required to delete the request.",
                success: false,
                error: true
            });
        }

        const deletedRequest = await FriendReqModel.findOneAndDelete({
            requester: userid,
            recipient: recipient
        });

        if (!deletedRequest) {
            return res.status(404).json({
                message: "Friend request not found.",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            message: 'Friend request deleted successfully.',
            error: false,
            success: true,
            data: deletedRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function acceptReq(req, res) {
    try {
        const userid = req.userId;
        const { recipient } = req.body;

        if (!recipient) {
            return res.status(400).json({
                message: "Recipient ID is required to accept the request.",
                success: false,
                error: true
            });
        }

        const updatedRequest = await FriendReqModel.findOneAndUpdate(
            { requester: recipient, recipient: userid, status: "sent" },
            { status: "accepted", isFriend: true },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({
                message: "Friend request not found or already accepted.",
                success: false,
                error: true
            });
        }

        const newFriendship = new FriendListModel({
            user1: recipient,
            user2: userid
        }).populate('user1 user2')

        await newFriendship.save();

        return res.status(200).json({
            message: "Friend request accepted and friendship created successfully.",
            success: true,
            error: false,
            data: {
                friendRequest: updatedRequest,
                friendship: newFriendship
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}
export async function rejectFriendReq(req, res) {
    try {
        const userId = req.userId;
        const { requesterId } = req.body; // The person who sent the request

        if (!requesterId) {
            return res.status(400).json({
                message: "Requester ID is required to reject the request.",
                success: false,
                error: true
            });
        }

        // Find and delete the friend request where user is recipient
        const deletedRequest = await FriendReqModel.findOneAndDelete({
            requester: requesterId,
            recipient: userId,
            status: { $in: ['pending', 'sent'] }
        });

        if (!deletedRequest) {
            return res.status(404).json({
                message: "Friend request not found or already responded.",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            message: "Friend request rejected and deleted successfully.",
            success: true,
            error: false,
            data: deletedRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}

