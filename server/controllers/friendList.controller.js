import FriendListModel from "../models/friendList.model.js";

export async function listAllFriends(req, res) {
    try {
        const userId = req.userId; // Logged-in user's ID

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required.",
                success: false,
                error: true
            });
        }

        // Find all friendships where user is either user1 or user2
        const friends = await FriendListModel.find({
            $or: [
                { user1: userId },
                { user2: userId }
            ]
        }).populate("user1 user2", "name email profilePhoto");
        // you can select fields you want

        if (!friends.length) {
            return res.status(200).json({
                message: "No friends found.",
                success: true,
                error: false,
                data: []
            });
        }

        const friendList = friends.map(friendship => {
            let friend = (friendship.user1._id.toString() === userId)
                ? friendship.user2
                : friendship.user1;

            return {
                _id: friend._id,
                name: friend.name,
                email: friend.email,
                profilePhoto: friend.profilePhoto
            };
        });

        return res.status(200).json({
            message: "Friends fetched successfully.",
            success: true,
            error: false,
            data: friendList
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}
export async function unfriend(req, res) {
    try {
        const userId = req.userId;
        const { friendId } = req.body;

        if (!friendId) {
            return res.status(400).json({
                message: "Friend ID is required to unfriend.",
                success: false,
                error: true
            });
        }

        // Find and delete the friendship where the two users are matched
        const deletedFriendship = await FriendListModel.findOneAndDelete({
            $or: [
                { user1: userId, user2: friendId },
                { user1: friendId, user2: userId }
            ]
        });

        if (!deletedFriendship) {
            return res.status(404).json({
                message: "Friendship not found or already removed.",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            message: "Friend unfriended successfully.",
            success: true,
            error: false,
            data: deletedFriendship
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}