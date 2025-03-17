import React from "react";
import { View } from "react-native";
import LoginScreen from "../../components/auth/LoginScreen";

export default function LoginScreenStoryboard() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <LoginScreen />
    </View>
  );
}
