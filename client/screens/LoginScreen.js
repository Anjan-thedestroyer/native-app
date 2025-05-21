import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView
} from 'react-native';
import AuthInput from '../components/AuthInput';
import { loginUser } from '../utils/Api.js';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await loginUser(email, password);
            Alert.alert('Login Successful', 'You have been logged in!');
            navigation.replace('Home'); // or any route after login
        } catch (error) {
            Alert.alert('Login Failed', error.message || 'Something went wrong');
        }

    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'android' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.container}>
                        <AuthInput
                            placeholder='Enter email'
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <AuthInput
                            placeholder='Enter password'
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPressIn={handleLogin}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>
                        <Text style={styles.orText}>OR</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SignUp')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.signupText}>
                                Don't have an account? <Text style={styles.link}>Sign up</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        justifyContent: 'center',
        flexGrow: 1,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#3797EF',
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 12,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 16,
        color: '#999',
    },
    signupText: {
        textAlign: 'center',
        color: '#333',
    },
    link: {
        color: '#3797EF',
        fontWeight: '600',
    },
});

export default LoginScreen;
