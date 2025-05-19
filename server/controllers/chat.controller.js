import ChatModel from "../models/chat.model.js";

// Helper to emit to room
function emitToChat(io, chatID, event, payload) {
    io.to(chatID).emit(event, payload);
}

export async function addMembers(req, res) {
    const io = req.app.get("io");
    try {
        const { member, chatID } = req.body;
        if (!member) {
            return res.status(400).json({
                message: "Please provide the member ID",
                error: true,
                success: false
            });
        }

        const updatedChat = await ChatModel.findByIdAndUpdate(
            chatID,
            { $push: { members: { user: member, role: "member" } } },
            { new: true }
        );

        if (!updatedChat) {
            return res.status(404).json({
                message: "Chat not found",
                error: true,
                success: false
            });
        }

        emitToChat(io, chatID, "member-added", {
            chatID,
            member
        });

        return res.status(200).json({
            message: "Member added successfully",
            data: updatedChat,
            error: false,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while adding the member",
            error: true,
            success: false
        });
    }
}

export async function removeMembers(req, res) {
    const io = req.app.get("io");
    try {
        const userId = req.userId;
        const { chatID, member } = req.body;

        if (!chatID || !member) {
            return res.status(400).json({
                message: "Please enter all required fields",
                error: true,
                success: false
            });
        }

        const chat = await ChatModel.findById(chatID);
        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
                error: true,
                success: false
            });
        }

        const requestingUser = chat.members.find(m => m.user === userId);
        if (!requestingUser || requestingUser.role !== "admin") {
            return res.status(403).json({
                message: "Only admins can remove members from the chat",
                error: true,
                success: false
            });
        }

        const memberToRemove = chat.members.find(m => m.user === member);
        if (!memberToRemove) {
            return res.status(404).json({
                message: "Member not found in the chat",
                error: true,
                success: false
            });
        }

        if (memberToRemove.role === "admin") {
            const adminCount = chat.members.filter(m => m.role === "admin").length;
            if (adminCount === 1) {
                return res.status(403).json({
                    message: "Cannot remove the last admin from the chat",
                    error: true,
                    success: false
                });
            }
        }

        chat.members = chat.members.filter(m => m.user !== member);
        await chat.save();

        emitToChat(io, chatID, "member-removed", {
            chatID,
            member
        });

        return res.status(200).json({
            message: "Member removed successfully",
            data: chat,
            error: false,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while removing the member",
            error: true,
            success: false
        });
    }
}

export async function quitChat(req, res) {
    const io = req.app.get("io");
    try {
        const userId = req.userId;
        const { chatID, member } = req.body;

        if (!chatID || !member) {
            return res.status(400).json({
                message: "Please enter all required fields",
                error: true,
                success: false
            });
        }

        if (userId !== member) {
            return res.status(403).json({
                message: "You can only quit with your own ID",
                error: true,
                success: false
            });
        }

        const quitChat = await ChatModel.findByIdAndUpdate(
            chatID,
            { $pull: { members: { user: member } } },
            { new: true }
        );

        emitToChat(io, chatID, "member-quit", {
            chatID,
            member
        });

        return res.status(200).json({
            message: "Group exited successfully",
            data: quitChat,
            success: true,
            error: false
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while quitting the group",
            error: true,
            success: false
        });
    }
}

export async function changeRole(req, res) {
    const io = req.app.get("io");
    try {
        const userId = req.userId;
        const { chatID, member, status } = req.body;

        if (!chatID || !member || !status) {
            return res.status(400).json({
                message: "Please enter all required fields",
                error: true,
                success: false
            });
        }

        const chat = await ChatModel.findById(chatID);
        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
                error: true,
                success: false
            });
        }

        const requestingUser = chat.members.find(m => m.user === userId);
        if (!requestingUser || requestingUser.role !== "admin") {
            return res.status(403).json({
                message: "Only admins can change roles in the chat",
                error: true,
                success: false
            });
        }

        const memberToUpdate = chat.members.find(m => m.user === member);
        if (!memberToUpdate) {
            return res.status(404).json({
                message: "Member not found in the chat",
                error: true,
                success: false
            });
        }

        memberToUpdate.role = status;
        await chat.save();

        emitToChat(io, chatID, "role-changed", {
            chatID,
            member,
            status
        });

        return res.status(200).json({
            message: "Role updated successfully",
            data: chat,
            success: true,
            error: false
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while changing the role",
            error: true,
            success: false
        });
    }
}
