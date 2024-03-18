import React, { useState, useEffect } from "react";
import { StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import io from "socket.io-client";

export default function App() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userOnline, setUserOnline] = useState(false);
  const socket = io("http://192.168.18.16:3000");

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setChatMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("user status", (status) => {
      setUserOnline(status);
    });

    return () => {
      socket.off("chat message");
      socket.off("user status");
    };
  }, []);

  const submitChatMessage = () => {
    socket.emit("chat message", { message: chatMessage, user: "You" });
    setChatMessage("");
  };

  const renderedChatMessages = chatMessages.map((chatMessage, index) => (
    <View
      key={index}
      style={
        chatMessage.user === "You"
          ? styles.myMessageContainer
          : styles.otherMessageContainer
      }
    >
      <View style={styles.bubble}>
        <Text style={styles.message}>{chatMessage.message}</Text>
      </View>
    </View>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {userOnline ? "Online" : "Offline"}
        </Text>
      </View>
      <View style={styles.chatContainer}>{renderedChatMessages}</View>
      <TextInput
        style={{ height: 40, borderWidth: 2 }}
        autoCorrect={false}
        onSubmitEditing={submitChatMessage}
        onChangeText={setChatMessage}
        value={chatMessage}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray.400",
    padding: 20,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  myMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  otherMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  bubble: {
    backgroundColor: "lightblue",
    borderRadius: 10,
    padding: 10,
  },
  message: {
    fontSize: 16,
  },
});
