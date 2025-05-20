import ChatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

let io;

export function setIO(ioInstance) {
    io = ioInstance;
}

export async function sendMessage(req, res) {
    try {
        const senderId = req.userId;
        const { recipientId, message } = req.body;

        if (!recipientId || !message) {
            return res.status(400).json({
                message: "Recipient ID and message content are required.",
                success: false,
                error: true
            });
        }

        let chat = await ChatModel.findOne({
            $and: [
                { members: { $elemMatch: { user: senderId } } },
                { members: { $elemMatch: { user: recipientId } } }
            ],
            isGroup: false
        });

        if (!chat) {
            chat = new ChatModel({
                name: "Private Chat",
                members: [
                    { user: senderId, role: 'admin' },
                    { user: recipientId, role: 'member' }
                ],
                groupImage: "",
                isGroup: false
            });
            await chat.save();
        }

        const newMessage = new messageModel({
            sender: senderId,
            chat: chat._id,
            message,
            status: "sent"
        });

        const savedMessage = await newMessage.save();
        const populatedMessage = await savedMessage.populate("sender");

        chat.messages.push(savedMessage._id);
        await chat.save();

        io.to(senderId).emit("receive-message", populatedMessage);
        io.to(recipientId).emit("receive-message", populatedMessage);

        return res.status(200).json({
            message: "Message sent successfully.",
            success: true,
            data: populatedMessage
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}

export async function getMessages(req, res) {
    try {
        const { chatId } = req.body;

        if (!chatId) {
            return res.status(400).json({
                message: "Chat ID is required to fetch messages.",
                success: false,
                error: true
            });
        }

        const messages = await messageModel
            .find({ chat: chatId })
            .populate("sender", "username")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            message: "Messages fetched successfully.",
            success: true,
            data: messages
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}

// ✅ Update Message Status
export async function updateMessageStatus(req, res) {
    try {
        const { messageId } = req.params;
        const { status } = req.body;

        if (!messageId || !status) {
            return res.status(400).json({
                message: "Message ID and status are required.",
                success: false,
                error: true
            });
        }

        if (!["sending", "sent", "seen"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status.",
                success: false,
                error: true
            });
        }

        const updatedMessage = await messageModel.findByIdAndUpdate(
            messageId,
            { status },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({
                message: "Message not found.",
                success: false,
                error: true
            });
        }

        // Notify participants of status update
        io.to(updatedMessage.chat.toString()).emit("update-status", {
            messageId: updatedMessage._id,
            status: updatedMessage.status
        });

        return res.status(200).json({
            message: "Message status updated successfully.",
            success: true,
            data: updatedMessage
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}

// ✅ Delete Message
export async function deleteMessage(req, res) {
    try {
        const senderId = req.userId;
        const { messageId } = req.params;

        if (!messageId || !senderId) {
            return res.status(400).json({
                message: "Message ID and auth is required.",
                success: false,
                error: true
            });
        }

        const check = await messageModel.findById(messageId);
        if (!check) {
            return res.status(404).json({
                message: "Message not found.",
                success: false,
                error: true
            });
        }

        if (check.sender.toString() !== senderId.toString()) {
            return res.status(403).json({
                message: "Only sender can delete the message.",
                success: false,
                error: true
            });
        }

        await ChatModel.updateMany(
            { messages: messageId },
            { $pull: { messages: messageId } }
        );

        const deletedMessage = await messageModel.findByIdAndDelete(messageId);

        // Emit deletion event
        io.to(check.chat.toString()).emit("deleted-message", {
            messageId: deletedMessage._id
        });

        return res.status(200).json({
            message: "Message deleted successfully.",
            success: true,
            data: deletedMessage
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}
