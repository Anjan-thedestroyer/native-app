import jwt from 'jsonwebtoken';

const auth = async (request, response, next) => {
    try {
        let token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];

        if (!token) {
            const email = request.body.email || request.query.email;

            if (!email) {
                return response.status(401).json({
                    message: "Provide token or email",
                });
            }

            token = jwt.sign({ email }, process.env.SECRET_KEY_ACCESS_TOKEN, { expiresIn: '1h' });

            response.cookie('accessToken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decode) {
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false,
            });
        }

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
