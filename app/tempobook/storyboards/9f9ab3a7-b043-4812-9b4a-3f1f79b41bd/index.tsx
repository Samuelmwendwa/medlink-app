import React from "react";
import { View } from "react-native";
import LoginScreen from "../../../../components/auth/LoginScreen";

export default function LoginPageStoryboard() {
  return (
    <View className="flex-1 bg-gray-50">
      <LoginScreen />
    </View>
  );
}
