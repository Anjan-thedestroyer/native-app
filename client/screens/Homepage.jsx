import { View, Text, StyleSheet, ImageBackground, TextInput, Pressable } from 'react-native'
import React, { useContext } from 'react'
import homeImage from '../assets/home-image.jpg'
import { GlobalContext } from '../context'
const Homepage = () => {
    const { showLoginView, setShowLoginView } = useContext(GlobalContext)
    return (
        <View
            style={styles.mainWrapper}
        >
            <ImageBackground style={styles.image} source={homeImage} />
            <View style={styles.content}>
                {

                    showLoginView ?
                        <View>
                            <View>
                                <Text>Enter your name</Text>
                                <TextInput
                                    autoCorrect={false}
                                    placeholder='Enter your name'
                                    onChangeText={(value) => setCurrentUserName(value)}
                                    style={styles.loginInput}
                                    value={CurrentUserName}
                                />
                            </View>
                            <View>
                                <Pressable>
                                    <View>
                                        <Text>Register</Text>
                                    </View>

                                </Pressable>
                            </View>
                            <View>
                                <Pressable>
                                    <View>
                                        <Text>login</Text>
                                    </View>

                                </Pressable>
                            </View>

                        </View>
                        :
                        <View>

                        </View>
                }

            </View>
        </View>
    )
}

export default Homepage
const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1
    },
    image: {
        flex: 2,
        justifyContent: "center",
        width: '100%',
    },
    content: {
        flex: 1
    }
})