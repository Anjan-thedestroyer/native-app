const Base_URL = "http://localhost:8080"

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${Base_URL}/chat/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
};