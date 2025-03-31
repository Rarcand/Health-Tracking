import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (username === "test" && password === "password") {  
      router.replace("/(tabs)"); // Redirect to main app
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Phizzy</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
        <Text style={styles.buttonText}>Enter Phizzy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#4a2dbb" },
  logo: { fontSize: 40, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  input: { width: "80%", backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 10 },
  buttonPrimary: { backgroundColor: "#ff7f50", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
