import React, { useState, ReactNode } from "react";
import { View, SafeAreaView, useWindowDimensions } from "react-native";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";

interface DashboardLayoutProps {
  children?: ReactNode;
  userRole?: "Administrator" | "Medical Staff" | "Reception";
  userName?: string;
  hospitalName?: string;
  activePage?: string;
}

const DashboardLayout = ({
  children,
  userRole = "Administrator",
  userName,
  hospitalName = "City Hospital",
  activePage = "dashboard",
}: DashboardLayoutProps) => {
  const { userProfile } = useAuth();
  const displayName = userName || userProfile?.name || "Dr. Jane Smith";
  const { width } = useWindowDimensions();
  const [isSidebarOpen, setIsSidebarOpen] = useState(width >= 768);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (page: string) => {
    // In a real app, this would navigate to the appropriate route
    console.log(`Navigating to ${page}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 flex-row">
        {/* Sidebar - conditionally rendered based on screen size and state */}
        {isSidebarOpen && (
          <View className="z-10">
            <Sidebar
              userRole={userRole}
              activePage={activePage}
              onNavigate={handleNavigation}
            />
          </View>
        )}

        {/* Main Content Area */}
        <View className="flex-1 flex-col">
          {/* Header */}
          <Header
            hospitalName={hospitalName}
            userName={displayName}
            userRole={userRole}
            notificationCount={notificationCount}
            onMenuToggle={handleMenuToggle}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Content */}
          <View className="flex-1 p-4 bg-gray-50">{children}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DashboardLayout;
