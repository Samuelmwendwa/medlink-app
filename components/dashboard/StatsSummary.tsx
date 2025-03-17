import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Bed, Users, AlertTriangle, Activity } from "lucide-react-native";

interface StatsSummaryProps {
  totalBeds?: number;
  occupiedBeds?: number;
  availableBeds?: number;
  maintenanceBeds?: number;
  waitingPatients?: number;
  averageWaitTime?: number;
  staffOnDuty?: number;
  activeAlerts?: number;
}

const StatsSummary = ({
  totalBeds = 120,
  occupiedBeds = 87,
  availableBeds = 25,
  maintenanceBeds = 8,
  waitingPatients = 14,
  averageWaitTime = 32,
  staffOnDuty = 45,
  activeAlerts = 2,
}: StatsSummaryProps) => {
  // Calculate occupancy rate
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  // Get color for occupancy rate
  const getOccupancyColor = () => {
    if (occupancyRate >= 90) return "text-red-600";
    if (occupancyRate >= 75) return "text-orange-500";
    if (occupancyRate >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <View className="w-full bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Hospital Overview
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {/* Bed Statistics */}
        <View className="w-[23%] bg-blue-50 p-3 rounded-lg">
          <View className="flex-row items-center mb-2">
            <Bed size={20} color="#3b82f6" />
            <Text className="ml-2 font-semibold text-blue-800">Bed Status</Text>
          </View>
          <Text className="text-2xl font-bold text-blue-700">{totalBeds}</Text>
          <Text className="text-sm text-blue-800">Total Beds</Text>

          <View className="mt-2 flex-row justify-between">
            <View>
              <Text className="text-green-600 font-medium">
                {availableBeds}
              </Text>
              <Text className="text-xs text-gray-600">Available</Text>
            </View>
            <View>
              <Text className="text-red-600 font-medium">{occupiedBeds}</Text>
              <Text className="text-xs text-gray-600">Occupied</Text>
            </View>
            <View>
              <Text className="text-yellow-600 font-medium">
                {maintenanceBeds}
              </Text>
              <Text className="text-xs text-gray-600">Maintenance</Text>
            </View>
          </View>

          <View className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-500"
              style={{ width: `${occupancyRate}%` }}
            />
          </View>
          <Text
            className={`text-right text-sm font-medium ${getOccupancyColor()}`}
          >
            {occupancyRate}% Occupancy
          </Text>
        </View>

        {/* Patient Queue */}
        <View className="w-[23%] bg-purple-50 p-3 rounded-lg">
          <View className="flex-row items-center mb-2">
            <Users size={20} color="#8b5cf6" />
            <Text className="ml-2 font-semibold text-purple-800">
              Patient Queue
            </Text>
          </View>
          <Text className="text-2xl font-bold text-purple-700">
            {waitingPatients}
          </Text>
          <Text className="text-sm text-purple-800">Waiting Patients</Text>

          <View className="mt-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Average Wait:</Text>
              <Text className="text-purple-700 font-medium">
                {averageWaitTime} min
              </Text>
            </View>

            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-sm text-gray-600">Longest Wait:</Text>
              <Text className="text-purple-700 font-medium">68 min</Text>
            </View>
          </View>

          <View className="mt-3 flex-row justify-between">
            <View className="bg-purple-100 px-2 py-1 rounded">
              <Text className="text-xs text-purple-800">Emergency: 5</Text>
            </View>
            <View className="bg-purple-100 px-2 py-1 rounded">
              <Text className="text-xs text-purple-800">General: 9</Text>
            </View>
          </View>
        </View>

        {/* Staff Status */}
        <View className="w-[23%] bg-green-50 p-3 rounded-lg">
          <View className="flex-row items-center mb-2">
            <Activity size={20} color="#10b981" />
            <Text className="ml-2 font-semibold text-green-800">
              Staff Status
            </Text>
          </View>
          <Text className="text-2xl font-bold text-green-700">
            {staffOnDuty}
          </Text>
          <Text className="text-sm text-green-800">Staff On Duty</Text>

          <View className="mt-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Doctors:</Text>
              <Text className="text-green-700 font-medium">12</Text>
            </View>

            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-sm text-gray-600">Nurses:</Text>
              <Text className="text-green-700 font-medium">28</Text>
            </View>

            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-sm text-gray-600">Support:</Text>
              <Text className="text-green-700 font-medium">5</Text>
            </View>
          </View>

          <View className="mt-3 bg-green-100 px-2 py-1 rounded">
            <Text className="text-xs text-green-800 text-center">
              Next shift change: 19:30
            </Text>
          </View>
        </View>

        {/* Alerts */}
        <View className="w-[23%] bg-red-50 p-3 rounded-lg">
          <View className="flex-row items-center mb-2">
            <AlertTriangle size={20} color="#ef4444" />
            <Text className="ml-2 font-semibold text-red-800">
              Active Alerts
            </Text>
          </View>
          <Text className="text-2xl font-bold text-red-700">
            {activeAlerts}
          </Text>
          <Text className="text-sm text-red-800">Critical Situations</Text>

          {activeAlerts > 0 ? (
            <View className="mt-2">
              <View className="bg-red-100 p-2 rounded mb-2">
                <Text className="text-xs font-medium text-red-800">
                  Code Blue - ICU Room 302
                </Text>
                <Text className="text-xs text-red-700">Started 5 min ago</Text>
              </View>

              {activeAlerts > 1 && (
                <View className="bg-red-100 p-2 rounded">
                  <Text className="text-xs font-medium text-red-800">
                    Staff Shortage - ER
                  </Text>
                  <Text className="text-xs text-red-700">
                    Started 15 min ago
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View className="mt-2 bg-green-100 p-2 rounded">
              <Text className="text-xs text-green-800 text-center">
                No active alerts
              </Text>
            </View>
          )}

          <TouchableOpacity className="mt-3 bg-red-100 px-2 py-1 rounded">
            <Text className="text-xs text-red-800 text-center font-medium">
              View All Alerts
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StatsSummary;
