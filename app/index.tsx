import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatsSummary from "../components/dashboard/StatsSummary";
import BedManagement from "../components/dashboard/BedManagement";
import PatientQueue from "../components/dashboard/PatientQueue";
import ResourceAllocation from "../components/dashboard/ResourceAllocation";
import EmergencyAlerts from "../components/dashboard/EmergencyAlerts";
import { useAuth } from "../contexts/AuthContext";

export default function MainDashboard() {
  const { userProfile, isLoading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");

  // Ensure user is authenticated before showing dashboard
  useEffect(() => {
    if (!isLoading && !userProfile) {
      console.log("Dashboard: Not authenticated, redirecting to login");
      router.replace("/auth/login");
    }
  }, [userProfile, isLoading, router]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading dashboard...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return null; // Will redirect to login
  }

  // Get user role from auth context
  const userRole =
    (userProfile?.role as "Administrator" | "Medical Staff" | "Reception") ||
    "Administrator";

  console.log("Current user role:", userRole);

  // Handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section);

    // Navigate to the appropriate route
    if (section !== "dashboard") {
      router.push(`/${section}`);
    }
  };

  // Render the appropriate section based on activeSection
  const renderSection = () => {
    switch (activeSection) {
      case "beds":
        return <BedManagement />;
      case "patients":
        return <PatientQueue />;
      case "resources":
        return <ResourceAllocation />;
      case "alerts":
        return <EmergencyAlerts />;
      case "dashboard":
      default:
        return (
          <ScrollView className="flex-1">
            {/* Stats Summary */}
            <View className="mb-6">
              <StatsSummary
                totalBeds={120}
                occupiedBeds={87}
                availableBeds={25}
                maintenanceBeds={8}
                waitingPatients={14}
                averageWaitTime={32}
                staffOnDuty={45}
                activeAlerts={2}
              />
            </View>

            {/* Quick Access Cards */}
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-800 mb-4 px-1">
                Quick Access
              </Text>
              <View className="flex-row flex-wrap">
                <TouchableOpacity
                  className="w-1/4 p-2"
                  onPress={() => setActiveSection("beds")}
                >
                  <View className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <Text className="text-blue-800 font-bold text-lg mb-1">
                      Bed Management
                    </Text>
                    <Text className="text-blue-600">25 beds available</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-1/4 p-2"
                  onPress={() => setActiveSection("patients")}
                >
                  <View className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <Text className="text-purple-800 font-bold text-lg mb-1">
                      Patient Queue
                    </Text>
                    <Text className="text-purple-600">14 patients waiting</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-1/4 p-2"
                  onPress={() => setActiveSection("resources")}
                >
                  <View className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <Text className="text-green-800 font-bold text-lg mb-1">
                      Resources
                    </Text>
                    <Text className="text-green-600">45 staff on duty</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-1/4 p-2"
                  onPress={() => setActiveSection("alerts")}
                >
                  <View className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <Text className="text-red-800 font-bold text-lg mb-1">
                      Alerts
                    </Text>
                    <Text className="text-red-600">2 active alerts</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Activity */}
            <View className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Recent Activity
              </Text>

              <View className="border-l-4 border-blue-500 pl-3 mb-3 py-1">
                <Text className="font-medium">
                  Bed #B-1024 status changed to Available
                </Text>
                <Text className="text-gray-500 text-sm">
                  10 minutes ago by Dr. Jane Smith
                </Text>
              </View>

              <View className="border-l-4 border-purple-500 pl-3 mb-3 py-1">
                <Text className="font-medium">
                  New patient John Doe added to queue
                </Text>
                <Text className="text-gray-500 text-sm">
                  25 minutes ago by Reception Staff
                </Text>
              </View>

              <View className="border-l-4 border-red-500 pl-3 mb-3 py-1">
                <Text className="font-medium">
                  Code Blue alert triggered in ICU
                </Text>
                <Text className="text-gray-500 text-sm">
                  45 minutes ago by Dr. Robert Johnson
                </Text>
              </View>

              <View className="border-l-4 border-green-500 pl-3 mb-3 py-1">
                <Text className="font-medium">
                  Staff allocation updated for Emergency Department
                </Text>
                <Text className="text-gray-500 text-sm">
                  1 hour ago by Administrator
                </Text>
              </View>

              <TouchableOpacity className="self-end">
                <Text className="text-blue-600 font-medium">
                  View All Activity
                </Text>
              </TouchableOpacity>
            </View>

            {/* Hospital Occupancy Trends */}
            <View className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Hospital Occupancy Trends
              </Text>

              <View className="h-40 flex-row items-end justify-between px-4">
                <View className="items-center">
                  <View
                    className="w-8 bg-blue-500 rounded-t-md"
                    style={{ height: "60%" }}
                  />
                  <Text className="text-xs mt-1">Mon</Text>
                </View>
                <View className="items-center">
                  <View
                    className="w-8 bg-blue-500 rounded-t-md"
                    style={{ height: "70%" }}
                  />
                  <Text className="text-xs mt-1">Tue</Text>
                </View>
                <View className="items-center">
                  <View
                    className="w-8 bg-blue-500 rounded-t-md"
                    style={{ height: "65%" }}
                  />
                  <Text className="text-xs mt-1">Wed</Text>
                </View>
                <View className="items-center">
                  <View
                    className="w-8 bg-blue-500 rounded-t-md"
                    style={{ height: "80%" }}
                  />
                  <Text className="text-xs mt-1">Thu</Text>
                </View>
                <View className="items-center">
                  <View
                    className="w-8 bg-blue-500 rounded-t-md"
                    style={{ height: "85%" }}
                  />
                  <Text className="text-xs mt-1">Fri</Text>
                </View>
                <View className="items-center">
                  <View
                    className="w-8 bg-blue-500 rounded-t-md"
                    style={{ height: "75%" }}
                  />
                  <Text className="text-xs mt-1">Sat</Text>
                </View>
                <View className="items-center">
                  <View
                    className="w-8 bg-blue-500 rounded-t-md"
                    style={{ height: "72%" }}
                  />
                  <Text className="text-xs mt-1">Sun</Text>
                </View>
              </View>

              <View className="flex-row justify-between mt-4">
                <View>
                  <Text className="text-gray-500">Average Occupancy</Text>
                  <Text className="text-2xl font-bold">72%</Text>
                </View>
                <View>
                  <Text className="text-gray-500">Peak Day</Text>
                  <Text className="text-2xl font-bold">Friday</Text>
                </View>
                <View>
                  <Text className="text-gray-500">Trend</Text>
                  <Text className="text-2xl font-bold text-yellow-500">
                    +5%
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <DashboardLayout
      userRole={userRole}
      activePage={activeSection}
      onNavigate={handleSectionChange}
    >
      {renderSection()}
    </DashboardLayout>
  );
}
