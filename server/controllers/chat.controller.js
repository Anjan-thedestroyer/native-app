import ChatModel from "../models/chat.model.js";

export async function addMembers(req, res) {
    try {
        const { member, chatID } = req.body;
        if (!member) {
            return res.status(400).json({
                message: "Please agive the members iD",
                error: true,
                success: false
            })
        }
        const newMember = await ChatModel.findByIdAndUpdate(chatID,
            { $push: { members: { user: member, role: 'member' } } },
            { new: true }
        )


        if (!newMember) {
            return res.status(404).json({
                message: "Chat not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Member added successfully",
            data: newMember,
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
        if (!requestingUser || requestingUser.role !== 'admin') {
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

        // Prevent removing last admin
        if (memberToRemove.role === 'admin') {
            const adminCount = chat.members.filter(m => m.role === 'admin').length;
            if (adminCount === 1) {
                return res.status(403).json({
                    message: "Cannot remove the last admin from the chat",
                    error: true,
                    success: false
                });
            }
        }

        // Remove member
        chat.members = chat.members.filter(m => m.userId !== member);
        await chat.save();

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
            return res.status(300).json({
                message: "enter your own Id",
                error: true,
                success: false
            })
        }
        const quit = await ChatModel.findByIdAndUpdate(chatID,
            { $pull: { members: { uer: member } } },
            { new: true }
        )
        return res.status(200).json({
            message: 'Group Quited successfully ',
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while removing the member",
            error: true,
            success: false
        });
    }
}

export async function changeRole(req, res) {
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

        // Check if the requesting user is an admin
        const requestingUser = chat.members.find(m => m.user === userId);
        if (!requestingUser || requestingUser.role !== 'admin') {
            return res.status(403).json({
                message: 'Only admins can change roles in the chat',
                error: true,
                success: false
            });
        }

        // Find the member to update
        const memberToUpdate = chat.members.find(m => m.user === member);
        if (!memberToUpdate) {
            return res.status(404).json({
                message: 'Member not found in the chat',
                error: true,
                success: false
            });
        }

        memberToUpdate.role = status;
        await chat.save();

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
