import React, { useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { supabase } from "../../lib/supabase";

type DemoUserType = "admin" | "doctor" | "reception";

interface DemoLoginButtonProps {
  userType: DemoUserType;
  onSuccess?: () => void;
}

const DemoLoginButton = ({ userType, onSuccess }: DemoLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const getUserCredentials = () => {
    switch (userType) {
      case "admin":
        return { email: "admin@hospital.org", password: "password123" };
      case "doctor":
        return { email: "doctor@hospital.org", password: "password123" };
      case "reception":
        return { email: "reception@hospital.org", password: "password123" };
    }
  };

  const getButtonLabel = () => {
    switch (userType) {
      case "admin":
        return "Login as Administrator";
      case "doctor":
        return "Login as Medical Staff";
      case "reception":
        return "Login as Reception";
    }
  };

  const getButtonColor = () => {
    switch (userType) {
      case "admin":
        return "bg-purple-600";
      case "doctor":
        return "bg-green-600";
      case "reception":
        return "bg-orange-600";
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const credentials = getUserCredentials();
      const { error } = await supabase.auth.signInWithPassword(credentials);

      if (error) {
        console.error("Demo login error:", error);
        alert(`Login failed: ${error.message}`);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Demo login error:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className={`py-3 rounded-md flex-row justify-center items-center ${getButtonColor()} ${isLoading ? "opacity-70" : ""}`}
      onPress={handleDemoLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className="text-white font-medium">{getButtonLabel()}</Text>
      )}
    </TouchableOpacity>
  );
};

export default DemoLoginButton;
