import jwt from 'jsonwebtoken';

const generatedAccessToken = async (userId) => {
    try {
        // Generate access token with a 5-hour expiry
        const token = await jwt.sign(
            { id: userId }, 
            process.env.SECRET_KEY_ACCESS_TOKEN, 
            { expiresIn: '5h' }
        );
        return token;
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Error generating access token");
    }
};

export default generatedAccessToken;
