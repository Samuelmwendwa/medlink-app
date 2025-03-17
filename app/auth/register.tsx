import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Mail,
  Lock,
  User,
  Building,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react-native";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Medical Staff");
  const [department, setDepartment] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const roles = ["Administrator", "Medical Staff", "Reception"];
  const departments = [
    "Emergency",
    "ICU",
    "Cardiology",
    "General Medicine",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Obstetrics & Gynecology",
    "Oncology",
  ];

  const handleRegister = async () => {
    // Validate inputs
    if (!email || !password || !name) {
      setErrorMessage("Please fill in all required fields");
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
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            department: department || null,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.user) {
        // Create profile entry
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email,
            name,
            role,
            department: department || null,
          },
        ]);

        if (profileError) {
          setErrorMessage(profileError.message);
          return;
        }

        // Show success message and redirect to login
        alert(
          "Registration successful! Please check your email to confirm your account.",
        );
        router.replace("/auth/login");
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
            {/* Header */}
            <View className="items-center mb-8">
              <Text className="text-2xl font-bold text-blue-800">
                Create an Account
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Register to access the hospital resource management system
              </Text>
            </View>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Full Name*</Text>
              <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                <User size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-2 text-gray-800"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Email*</Text>
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
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Password*</Text>
              <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                <Lock size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-2 text-gray-800"
                  placeholder="Create a password"
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
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                Confirm Password*
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                <Lock size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-2 text-gray-800"
                  placeholder="Confirm your password"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            {/* Role Selection */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                Select Role*
              </Text>
              <View className="flex-row justify-between">
                {roles.map((roleOption) => (
                  <TouchableOpacity
                    key={roleOption}
                    className={`flex-1 flex-row items-center justify-center py-3 mx-1 rounded-md ${role === roleOption ? "bg-blue-100 border border-blue-500" : "bg-gray-100 border border-gray-200"}`}
                    onPress={() => setRole(roleOption)}
                  >
                    <Building
                      size={18}
                      color={role === roleOption ? "#3b82f6" : "#6b7280"}
                      className="mr-2"
                    />
                    <Text
                      className={`text-sm font-medium ${role === roleOption ? "text-blue-700" : "text-gray-700"}`}
                    >
                      {roleOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Department Selection (only for Medical Staff) */}
            {role === "Medical Staff" && (
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">
                  Department
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-2"
                >
                  <View className="flex-row space-x-2">
                    {departments.map((dept) => (
                      <TouchableOpacity
                        key={dept}
                        className={`px-4 py-2 rounded-md ${department === dept ? "bg-purple-100 border border-purple-500" : "bg-gray-100"}`}
                        onPress={() => setDepartment(dept)}
                      >
                        <Text
                          className={`${department === dept ? "text-purple-700" : "text-gray-700"}`}
                        >
                          {dept}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Register Button */}
            <TouchableOpacity
              className={`bg-blue-600 py-3 rounded-md flex-row justify-center items-center mt-4 ${isLoading ? "opacity-70" : ""}`}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-lg">Register</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                <Text className="text-blue-600 font-medium">Sign In</Text>
              </TouchableOpacity>
            </View>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
