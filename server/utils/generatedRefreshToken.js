import jwt from 'jsonwebtoken';
import UserModel from "../models/user.model.js";

const generatedRefreshToken = async (userId) => {
    try {
        // Generate refresh token
        const token = jwt.sign(
            { id: userId }, 
            process.env.SECRET_KEY_REFRESH_TOKEN, 
            { expiresIn: '7d' }
        );

        // Update the user with the refresh token
        const updateResult = await UserModel.updateOne(
            { _id: userId }, 
            { refresh_token: token }
        );

        // Check if the update was successful
        if (updateResult.nModified === 0) {
            throw new Error('Failed to update user with refresh token');
        }

        // Return the generated refresh token
        return token;

    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Error generating refresh token");
    }
};

export default generatedRefreshToken;
