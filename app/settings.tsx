import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { Settings, Users, Bell, Shield, Save } from "lucide-react-native";

export default function SettingsPage() {
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || "Administrator";
  const {
    hospitalName,
    notificationsEnabled,
    autoLogout,
    darkMode,
    setHospitalName,
    setNotificationsEnabled,
    setAutoLogout,
    setDarkMode,
    saveSettings,
  } = useSettings();

  // Apply dark mode effect when it changes
  useEffect(() => {
    // In a real app, this would apply the dark mode theme to the entire app
    console.log("Dark mode changed to:", darkMode);
    // This is where you would apply the theme changes
  }, [darkMode]);

  const handleSaveSettings = async () => {
    try {
      await saveSettings();
      Alert.alert("Success", "Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  return (
    <DashboardLayout userRole={userRole as any} activePage="settings">
      <ScrollView className="flex-1 bg-gray-50 p-4">
        <View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <View className="flex-row items-center mb-4">
            <Settings size={24} color="#4b5563" />
            <Text className="text-2xl font-bold ml-2 text-gray-800">
              System Settings
            </Text>
          </View>

          <Text className="text-gray-600 mb-6">
            Configure system-wide settings and preferences for the hospital
            resource management system.
          </Text>

          {/* General Settings */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              General Settings
            </Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-2">Hospital Name</Text>
              <TextInput
                className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                value={hospitalName}
                onChangeText={setHospitalName}
              />
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-700">Enable Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
                thumbColor={notificationsEnabled ? "#3b82f6" : "#f3f4f6"}
              />
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-700">
                Auto Logout After Inactivity
              </Text>
              <Switch
                value={autoLogout}
                onValueChange={setAutoLogout}
                trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
                thumbColor={autoLogout ? "#3b82f6" : "#f3f4f6"}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
                thumbColor={darkMode ? "#3b82f6" : "#f3f4f6"}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-md flex-row justify-center items-center"
            onPress={handleSaveSettings}
          >
            <Save size={20} color="#ffffff" className="mr-2" />
            <Text className="text-white font-bold">Save Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}
