import React, { useState } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const AuthInput = ({ placeholder, secureTextEntry, value, onChangeText }) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#999"
                secureTextEntry={secureTextEntry && !showPassword}
                autoCapitalize="none"
                focusable
                keyboardAppearance='default'
                autoCorrect={false}
            />
            {secureTextEntry && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#999"
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: '#FAFAFA',
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginVertical: 8,
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingHorizontal: 8,
    },
})

export default AuthInput
