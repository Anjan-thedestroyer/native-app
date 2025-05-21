import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native'; // Make sure this is imported

const Base_URL = "http://192.168.1.73:8080"; // Use your actual IP

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${Base_URL}/chat/user/login`, {
            email,
            password
        });

        console.log("Login Response:", response.data); // Debug

        const { accesstoken, refreshToken } = response.data.data;

        console.log("Accesstoken:", accesstoken); // Debug

        await AsyncStorage.setItem('accessToken', accesstoken);
        await AsyncStorage.setItem('refreshToken', refreshToken);

        return response.data;
    } catch (error) {
        console.log(error)
        const message = error.response?.data?.message || 'Login failed';
        console.log("Login Error:", message);
        throw new Error(message);
    }
};
export const signUp = async (email, password, name) => {
    try {
        const response = await axios.post(`${Base_URL}/chat/user/register`, {
            email,
            password,
            name
        })
        console.log("Sign Up Response:", response.data); // Debug
        return response.data;

    } catch (error) {
        const message = error.response?.data?.message || 'User Register Failed';
        console.log("Register Error:", message);
        throw new Error(message);
    }
}
