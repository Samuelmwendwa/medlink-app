import React from "react";
import { View, Text, ScrollView } from "react-native";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { BarChart3, FileText, Download } from "lucide-react-native";

export default function ReportsPage() {
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || "Administrator";

  return (
    <DashboardLayout userRole={userRole as any} activePage="reports">
      <ScrollView className="flex-1 bg-gray-50 p-4">
        <View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <View className="flex-row items-center mb-4">
            <BarChart3 size={24} color="#4b5563" />
            <Text className="text-2xl font-bold ml-2 text-gray-800">
              Reports & Analytics
            </Text>
          </View>

          <Text className="text-gray-600 mb-6">
            View and generate reports on hospital resources, patient flow, and
            department performance.
          </Text>

          <View className="flex-row flex-wrap -mx-2">
            {[
              {
                title: "Bed Occupancy Report",
                description: "Daily and monthly bed utilization statistics",
              },
              {
                title: "Patient Wait Time Analysis",
                description: "Average wait times by department and priority",
              },
              {
                title: "Staff Allocation Report",
                description: "Staff distribution and workload analysis",
              },
              {
                title: "Resource Utilization",
                description: "Equipment and supply usage patterns",
              },
              {
                title: "Emergency Response Times",
                description: "Alert response and resolution metrics",
              },
              {
                title: "Department Performance",
                description: "Efficiency and throughput by department",
              },
            ].map((report, index) => (
              <View key={index} className="w-1/3 px-2 mb-4">
                <View className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full">
                  <View className="flex-row items-center mb-2">
                    <FileText size={18} color="#4b5563" />
                    <Text className="font-bold ml-2 text-gray-800">
                      {report.title}
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-sm mb-3">
                    {report.description}
                  </Text>
                  <View className="flex-row mt-auto">
                    <View className="bg-blue-100 px-2 py-1 rounded-md flex-row items-center">
                      <Download size={14} color="#3b82f6" />
                      <Text className="text-blue-600 text-xs ml-1">
                        Download
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}
