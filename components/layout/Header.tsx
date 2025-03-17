import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Bell, Settings, LogOut, Menu, X } from "lucide-react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { useSettings } from "../../contexts/SettingsContext";

interface HeaderProps {
  hospitalName?: string;
  userName?: string;
  userRole?: string;
  notificationCount?: number;
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

const Header = ({
  hospitalName = "General Hospital",
  userName = "Dr. Jane Smith",
  userRole = "Medical Staff",
  notificationCount = 3,
  onMenuToggle = () => {},
  isSidebarOpen = false,
}: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();
  const { darkMode } = useSettings();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Close notifications when clicking outside
  const handlePressOutside = () => {
    if (showNotifications) {
      setShowNotifications(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePressOutside}
      className={`w-full h-[60px] ${darkMode ? "bg-gray-800" : "bg-white"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"} px-4 flex-row items-center justify-between`}
    >
      {/* Left section with logo and hospital name */}
      <View className="flex-row items-center">
        <TouchableOpacity onPress={onMenuToggle} className="mr-2 md:hidden">
          {isSidebarOpen ? (
            <X size={24} color={darkMode ? "#e2e8f0" : "#334155"} />
          ) : (
            <Menu size={24} color={darkMode ? "#e2e8f0" : "#334155"} />
          )}
        </TouchableOpacity>

        <Image
          source={{
            uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=hospital",
          }}
          className="w-8 h-8 rounded-md mr-2"
        />
        <Text
          className={`text-lg font-bold ${darkMode ? "text-blue-300" : "text-blue-800"}`}
        >
          {hospitalName}
        </Text>
      </View>

      {/* Right section with user info and actions */}
      <View className="flex-row items-center">
        {/* Notifications */}
        <View className="relative mr-4">
          <TouchableOpacity onPress={toggleNotifications}>
            <Bell size={20} color={darkMode ? "#e2e8f0" : "#334155"} />
            {notificationCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Notification dropdown (simplified) */}
          {showNotifications && (
            <View
              className={`absolute top-10 right-0 w-64 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"} rounded-md shadow-md z-10 py-2`}
            >
              <Text
                className={`px-4 py-2 font-bold border-b ${darkMode ? "border-gray-700 text-white" : "border-gray-100 text-gray-800"}`}
              >
                Notifications
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowNotifications(false);
                  router.push("/alerts");
                }}
                className={`p-2 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}
              >
                <Text
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  Emergency in Ward B
                </Text>
                <Text
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  5 minutes ago
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowNotifications(false);
                  router.push("/patients");
                }}
                className={`p-2 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}
              >
                <Text
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  New patient added to queue
                </Text>
                <Text
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  15 minutes ago
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowNotifications(false);
                  router.push("/beds");
                }}
                className="p-2"
              >
                <Text
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  Bed status updated in ICU
                </Text>
                <Text
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  30 minutes ago
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Settings */}
        <TouchableOpacity
          className="mr-4"
          onPress={() => router.push("/settings")}
        >
          <Settings size={20} color={darkMode ? "#e2e8f0" : "#334155"} />
        </TouchableOpacity>

        {/* User info */}
        <View className="flex-row items-center">
          <View className="mr-4">
            <Text
              className={`font-medium text-right ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              {userName}
            </Text>
            <Text
              className={`text-xs text-right ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {userRole}
            </Text>
          </View>
          <Image
            source={{
              uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
            }}
            className="w-8 h-8 rounded-full"
          />
          <TouchableOpacity
            className="ml-4"
            onPress={() => {
              console.log("Header: Initiating logout");
              signOut();
            }}
          >
            <LogOut size={20} color={darkMode ? "#e2e8f0" : "#334155"} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Header;
