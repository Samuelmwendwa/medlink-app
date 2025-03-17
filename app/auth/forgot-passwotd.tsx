import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react-native";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          "https://reverent-satoshi9-u3hma.dev-2.tempolabs.ai/auth/reset-password",
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
                Reset Link Sent
              </Text>
              <Text className="text-gray-600 text-center mb-6">
                We've sent a password reset link to {email}. Please check your
                email and follow the instructions to reset your password.
              </Text>
              <TouchableOpacity
                className="bg-blue-600 py-3 px-6 rounded-md"
                onPress={() => router.replace("/auth/login")}
              >
                <Text className="text-white font-bold text-lg">
                  Return to Login
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Header */}
              <View className="items-center mb-8">
                <Text className="text-2xl font-bold text-blue-800">
                  Forgot Password
                </Text>
                <Text className="text-gray-500 text-center mt-2">
                  Enter your email address and we'll send you a link to reset
                  your password
                </Text>
              </View>

              {/* Email Input */}
              <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                  <Mail size={20} color="#6b7280" />
                  <TextInput
                    className="flex-1 ml-2 text-gray-800"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
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
                    Send Reset Link
                  </Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View className="mt-6 flex-row justify-center">
                <Text className="text-gray-600">Remember your password? </Text>
                <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                  <Text className="text-blue-600 font-medium">Sign In</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Back Button */}
        <TouchableOpacity
          className="mt-6 flex-row items-center"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#6b7280" />
          <Text className="ml-2 text-gray-600">Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
