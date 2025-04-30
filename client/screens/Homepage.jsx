import React from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import { Svg, Path } from "react-native-svg";

export default function Homepage() {
    const chatList = [
        { id: 1, name: "User1", message: "Sent a message", time: "03:25" },
        { id: 2, name: "User2", message: "Hello!", time: "03:26" },
        { id: 3, name: "User3", message: "How are you?", time: "03:27" },
        { id: 4, name: "User4", message: "Let's meet", time: "03:28" },
        { id: 5, name: "User5", message: "Sure!", time: "03:29" },
    ];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.chatList}>
                {chatList.map((chat) => (
                    <Pressable
                        key={chat.id}
                        style={({ pressed }) => [
                            styles.chatItem,
                            pressed && { backgroundColor: "black" },
                        ]}

                    >
                        <Svg width="60" height="60" viewBox="0 0 77 71">
                            <Path
                                d="M76.5 35.5C76.5 55.1 59 71 38 71S0 55.1 0 35.5 17 0 38 0s38.5 15.9 38.5 35.5Z"
                                fill="#D9D9D9"
                            />
                        </Svg>
                        <View style={styles.chatTextContainer}>
                            <Text style={styles.userName}>{chat.name}</Text>
                            <Text style={styles.message}>{chat.message}</Text>
                        </View>
                        <Text style={styles.time}>{chat.time}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 50,
    },
    chatList: {
        paddingHorizontal: 16,
    },
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    chatTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    message: {
        fontSize: 14,
        color: "#555",
    },
    time: {
        fontSize: 12,
        color: "#888",
        marginLeft: 10,
    },
});
