import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react-native";
import { supabase } from "../../lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Check if we have a valid access token from the URL
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setErrorMessage(
          "Invalid or expired reset link. Please request a new password reset.",
        );
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async () => {
    // Validate inputs
    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setIsSuccess(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1 justify-center items-center p-6">
        {errorMessage && (
          <View className="w-full max-w-[500px] bg-red-100 border border-red-400 p-4 rounded-md mb-4">
            <Text className="text-red-800">{errorMessage}</Text>
          </View>
        )}

        <View className="w-full max-w-[500px] bg-white p-8 rounded-xl shadow-md">
          {isSuccess ? (
            <View className="items-center">
              <CheckCircle size={64} color="#10b981" className="mb-4" />
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Password Reset Successful
              </Text>
              <Text className="text-gray-600 text-center mb-6">
                Your password has been successfully reset. You can now log in
                with your new password.
              </Text>
              <TouchableOpacity
                className="bg-blue-600 py-3 px-6 rounded-md"
                onPress={() => router.replace("/auth/login")}
              >
                <Text className="text-white font-bold text-lg">
                  Go to Login
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Header */}
              <View className="items-center mb-8">
                <Text className="text-2xl font-bold text-blue-800">
                  Reset Your Password
                </Text>
                <Text className="text-gray-500 text-center mt-2">
                  Create a new password for your account
                </Text>
              </View>

              {/* New Password Input */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">
                  New Password
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                  <Lock size={20} color="#6b7280" />
                  <TextInput
                    className="flex-1 ml-2 text-gray-800"
                    placeholder="Enter new password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-medium">
                  Confirm New Password
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                  <Lock size={20} color="#6b7280" />
                  <TextInput
                    className="flex-1 ml-2 text-gray-800"
                    placeholder="Confirm new password"
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className={`bg-blue-600 py-3 rounded-md flex-row justify-center items-center ${isLoading ? "opacity-70" : ""}`}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    Reset Password
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
