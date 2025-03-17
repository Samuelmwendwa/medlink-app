import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Lock,
  Mail,
  User,
  Building,
  LogIn,
  Eye,
  EyeOff,
} from "lucide-react-native";

interface LoginScreenProps {
  onLogin?: (credentials: {
    email: string;
    password: string;
    role: string;
  }) => void;
  isLoading?: boolean;
}

const LoginScreen = ({
  onLogin = () => {},
  isLoading = false,
}: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("Medical Staff");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const roles = ["Administrator", "Medical Staff", "Reception"];

  const handleLogin = () => {
    onLogin({ email, password, role: selectedRole });
    // For demo purposes, we'll log the selected role
    console.log(`Logging in with role: ${selectedRole}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Role Selection */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">
                Select Role
              </Text>
              <View className="flex-row justify-between">
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role}
                    className={`flex-1 flex-row items-center justify-center py-3 mx-1 rounded-md ${selectedRole === role ? "bg-blue-100 border border-blue-500" : "bg-gray-100 border border-gray-200"}`}
                    onPress={() => setSelectedRole(role)}
                  >
                    {role === "Administrator" && (
                      <User
                        size={18}
                        color={selectedRole === role ? "#3b82f6" : "#6b7280"}
                        className="mr-2"
                      />
                    )}
                    {role === "Medical Staff" && (
                      <User
                        size={18}
                        color={selectedRole === role ? "#3b82f6" : "#6b7280"}
                        className="mr-2"
                      />
                    )}
                    {role === "Reception" && (
                      <Building
                        size={18}
                        color={selectedRole === role ? "#3b82f6" : "#6b7280"}
                        className="mr-2"
                      />
                    )}
                    <Text
                      className={`text-sm font-medium ${selectedRole === role ? "text-blue-700" : "text-gray-700"}`}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  className={`w-5 h-5 mr-2 rounded border flex items-center justify-center ${rememberMe ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}
                >
                  {rememberMe && <Text className="text-white text-xs">✓</Text>}
                </View>
                <Text className="text-gray-700">Remember me</Text>
              </TouchableOpacity>

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
              <Text className="text-white font-bold text-lg">
                {isLoading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View className="mt-4 flex-row justify-center">
              <Text className="text-gray-500">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <Text className="text-blue-600 font-medium">Register</Text>
              </TouchableOpacity>
            </View>

            {/* Help Text */}
            <View className="mt-6">
              <Text className="text-gray-500 text-center">
                Having trouble logging in? Contact IT support at{" "}
                <Text className="text-blue-600">support@hospital.org</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
