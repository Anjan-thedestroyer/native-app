import ChatModel from "../models/chat.model";

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
            { $push: { members: member } },
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
        const check = await ChatModel.findById(userId).select('role')

        if (check.role = 'admin') {
            return res.status(300).json({
                message: 'only admin of the chat can remove people from the chat',
                error: true,
                success: false
            })
        }
        const updatedChat = await ChatModel.findByIdAndUpdate(
            chatID,
            { $pull: { members: member } }, // Pull removes the specific member from members array
            { new: true }
        );

        if (!updatedChat) {
            return res.status(404).json({
                message: "Chat not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Member removed successfully",
            data: updatedChat,
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
            { $pull: { members: member } },
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