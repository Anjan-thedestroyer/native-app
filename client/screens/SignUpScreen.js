import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import AuthInput from '../components/AuthInput'
const SignUpScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSign = () => {

    }
    return (
        <View style={styles.container}>
            <Text>Sign up</Text>
            <AuthInput
                placeholder='Enter your name'
                value={name}
                onChangeText={setName}
            />
            <AuthInput
                placeholder='Enter your email'
                value={email}
                onChangeText={setEmail}
            />
            <AuthInput
                placeholder='Enter your password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSign}>
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>OR</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}>
                <Text style={styles.loginText}>Already have an account. Login</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: 'bold',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 16,
        color: '#999',
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
    loginText: {
        textAlign: 'center',
        marginTop: 16,
        color: '#333',
    },
    link: {
        color: '#3797EF',
        fontWeight: '600',
    },
})
export default SignUpScreen