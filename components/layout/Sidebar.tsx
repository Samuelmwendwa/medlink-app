import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import {
  Home,
  Bed,
  Users,
  Stethoscope,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react-native";
import { useAuth } from "../../contexts/AuthContext";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onPress: () => void;
};

const NavItem = ({ icon, label, isActive = false, onPress }: NavItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-4 py-3 rounded-md mb-1 ${isActive ? "bg-blue-100" : "bg-transparent"}`}
    >
      <View className={`mr-3 ${isActive ? "text-blue-600" : "text-gray-500"}`}>
        {icon}
      </View>
      <Text
        className={`font-medium ${isActive ? "text-blue-600" : "text-gray-700"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

type SidebarProps = {
  userRole?: "Administrator" | "Medical Staff" | "Reception";
  activePage?: string;
  onNavigate?: (page: string) => void;
};

const Sidebar = ({
  userRole = "Administrator",
  activePage = "dashboard",
  onNavigate = () => {},
}: SidebarProps) => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleNavigation = (page: string) => {
    onNavigate(page);
    // Actually navigate to the page
    if (page !== "dashboard") {
      router.push(`/${page}`);
    } else {
      router.push("/");
    }
  };

  return (
    <View className="w-[280px] h-full bg-white border-r border-gray-200">
      {/* Hospital Logo */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <Image
            source={{
              uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=hospital",
            }}
            className="w-10 h-10 rounded-md bg-blue-100"
          />
          <View className="ml-3">
            <Text className="text-lg font-bold text-gray-800">
              City Hospital
            </Text>
            <Text className="text-xs text-gray-500">Resource Management</Text>
          </View>
        </View>
      </View>

      {/* User Info */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <Image
            source={{
              uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
            }}
            className="w-10 h-10 rounded-full bg-gray-100"
          />
          <View className="ml-3">
            <Text className="font-medium text-gray-800">Dr. Jane Smith</Text>
            <Text className="text-xs text-gray-500">{userRole}</Text>
          </View>
        </View>
      </View>

      {/* Navigation */}
      <ScrollView className="flex-1 px-2 py-4">
        <Text className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase">
          Main
        </Text>

        <NavItem
          icon={
            <Home
              size={20}
              color={activePage === "dashboard" ? "#2563eb" : "#6b7280"}
            />
          }
          label="Dashboard"
          isActive={activePage === "dashboard"}
          onPress={() => handleNavigation("dashboard")}
        />

        <NavItem
          icon={
            <Bed
              size={20}
              color={activePage === "beds" ? "#2563eb" : "#6b7280"}
            />
          }
          label="Bed Management"
          isActive={activePage === "beds"}
          onPress={() => handleNavigation("beds")}
        />

        {(userRole === "Administrator" ||
          userRole === "Medical Staff" ||
          userRole === "Reception") && (
          <NavItem
            icon={
              <Users
                size={20}
                color={activePage === "patients" ? "#2563eb" : "#6b7280"}
              />
            }
            label="Patient Queue"
            isActive={activePage === "patients"}
            onPress={() => handleNavigation("patients")}
          />
        )}

        {(userRole === "Administrator" || userRole === "Medical Staff") && (
          <NavItem
            icon={
              <Stethoscope
                size={20}
                color={activePage === "resources" ? "#2563eb" : "#6b7280"}
              />
            }
            label="Resource Allocation"
            isActive={activePage === "resources"}
            onPress={() => handleNavigation("resources")}
          />
        )}

        {(userRole === "Administrator" || userRole === "Medical Staff") && (
          <NavItem
            icon={
              <AlertTriangle
                size={20}
                color={activePage === "alerts" ? "#2563eb" : "#6b7280"}
              />
            }
            label="Emergency Alerts"
            isActive={activePage === "alerts"}
            onPress={() => handleNavigation("alerts")}
          />
        )}

        {userRole === "Administrator" && (
          <>
            <Text className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase">
              Administration
            </Text>

            <NavItem
              icon={
                <BarChart3
                  size={20}
                  color={activePage === "reports" ? "#2563eb" : "#6b7280"}
                />
              }
              label="Reports & Analytics"
              isActive={activePage === "reports"}
              onPress={() => handleNavigation("reports")}
            />

            <NavItem
              icon={
                <Settings
                  size={20}
                  color={activePage === "settings" ? "#2563eb" : "#6b7280"}
                />
              }
              label="System Settings"
              isActive={activePage === "settings"}
              onPress={() => handleNavigation("settings")}
            />
          </>
        )}
      </ScrollView>

      {/* Logout */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="flex-row items-center px-4 py-3 rounded-md bg-gray-50"
          onPress={() => {
            console.log("Sidebar: Initiating logout");
            signOut();
          }}
        >
          <LogOut size={20} color="#6b7280" className="mr-3" />
          <Text className="font-medium text-gray-700">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Sidebar;
