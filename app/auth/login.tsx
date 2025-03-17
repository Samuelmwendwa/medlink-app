import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login function
  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log(`Attempting demo login with ${demoEmail}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (error) {
        console.error("Demo login error:", error.message);
        setErrorMessage(error.message);
      } else {
        console.log("Demo login successful:", data.user?.id);
        router.replace("/");
      }
    } catch (error: any) {
      console.error("Demo login unexpected error:", error);
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center p-6">
          {errorMessage && (
            <View className="w-full max-w-[500px] bg-red-100 border border-red-400 p-4 rounded-md mb-4">
              <Text className="text-red-800">{errorMessage}</Text>
            </View>
          )}

          <View className="w-full max-w-[500px] bg-white p-8 rounded-xl shadow-md">
            {/* Header with Logo */}
            <View className="items-center mb-8">
              <Image
                source={{
                  uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=hospital",
                }}
                className="w-20 h-20 mb-4"
              />
              <Text className="text-2xl font-bold text-blue-800">
                Hospital Resource Management
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Sign in to access the hospital resource management dashboard
              </Text>
            </View>

            {/* Email Input */}
            <View className="mb-4">
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

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                <Lock size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-2 text-gray-800"
                  placeholder="Enter your password"
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

            {/* Forgot Password */}
            <View className="flex-row justify-end mb-6">
              <TouchableOpacity
                onPress={() => router.push("/auth/forgot-password")}
              >
                <Text className="text-blue-600">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`bg-blue-600 py-3 rounded-md flex-row justify-center items-center ${isLoading ? "opacity-70" : ""}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LogIn size={20} color="#ffffff" className="mr-2" />
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-gray-500">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <Text className="text-blue-600 font-medium">Register</Text>
              </TouchableOpacity>
            </View>

            {/* Demo Login */}
            <View className="mt-8 pt-6 border-t border-gray-200">
              <Text className="text-center text-gray-700 font-medium mb-3">
                Quick Demo Login
              </Text>
              <TouchableOpacity
                className="bg-purple-600 py-3 rounded-md flex-row justify-center items-center mb-2"
                onPress={() =>
                  handleDemoLogin("admin@hospital.org", "password123")
                }
              >
                <Text className="text-white font-medium">
                  Login as Administrator
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-600 py-3 rounded-md flex-row justify-center items-center mb-2"
                onPress={() =>
                  handleDemoLogin("doctor@hospital.org", "password123")
                }
              >
                <Text className="text-white font-medium">
                  Login as Medical Staff
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-orange-600 py-3 rounded-md flex-row justify-center items-center"
                onPress={() =>
                  handleDemoLogin("reception@hospital.org", "password123")
                }
              >
                <Text className="text-white font-medium">
                  Login as Reception
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
