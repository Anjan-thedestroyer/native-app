import jwt from 'jsonwebtoken';

const auth = async (request, response, next) => {
    try {
        // Check for token in cookies or headers
        let token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];

        // If no token is found, generate one using the email (if provided)
        if (!token) {
            const email = request.body.email || request.query.email;

            if (!email) {
                return response.status(401).json({
                    message: "Provide token or email",
                });
            }

            // Generate token using the email
            token = jwt.sign({ email }, process.env.SECRET_KEY_ACCESS_TOKEN, { expiresIn: '1h' });

            // Optionally, set the token in cookies for subsequent requests
            response.cookie('accessToken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        }

        // Verify the token
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decode) {
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false,
            });
        }

        // Add the decoded information (e.g., email or ID) to the request object
        request.userId = decode.id || null;
        request.userEmail = decode.email || null;

        next();
    } catch (error) {
        return response.status(500).json({
            message: "Authentication failed",
            error: error.message || error,
            success: false,
        });
    }
};

export default auth;
