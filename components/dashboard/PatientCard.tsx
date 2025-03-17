import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Clock,
  AlertCircle,
  Bell,
  Edit,
  UserRound,
  ChevronRight,
} from "lucide-react-native";

interface PatientCardProps {
  id?: string;
  name?: string;
  waitTime?: number;
  priority?: "low" | "medium" | "high" | "critical";
  department?: string;
  onUpdateStatus?: () => void;
  onSendNotification?: () => void;
}

const PatientCard = ({
  id = "P-12345",
  name = "John Doe",
  waitTime = 45,
  priority = "medium",
  department = "Emergency",
  onUpdateStatus = () => {},
  onSendNotification = () => {},
}: PatientCardProps) => {
  // Get priority color based on level
  const getPriorityColor = () => {
    switch (priority) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleUpdateStatus = async () => {
    try {
      // Try to update in Supabase if available
      const { supabase } = require("../../lib/supabase");
      const { error } = await supabase
        .from("patients")
        .update({
          status: "updated",
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating patient status:", error);
      }
    } catch (e) {
      console.error("Error in status update:", e);
    }

    onUpdateStatus();
  };

  const handleSendNotification = () => {
    onSendNotification();
  };

  return (
    <View className="w-full bg-white rounded-lg shadow-sm mb-2 p-4 border border-gray-200">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="bg-gray-100 rounded-full p-2 mr-3">
            <UserRound size={24} color="#4b5563" />
          </View>
          <View>
            <Text className="text-lg font-bold text-gray-800">{name}</Text>
            <Text className="text-sm text-gray-500">ID: {id}</Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <View className={`h-4 w-4 rounded-full mr-2 ${getPriorityColor()}`} />
          <Text className="text-sm font-medium capitalize">{priority}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-4">
        <View className="flex-row items-center">
          <Clock size={16} color="#4b5563" className="mr-1" />
          <Text className="text-sm text-gray-600 mr-4">
            Wait: {waitTime} min
          </Text>

          <AlertCircle size={16} color="#4b5563" className="mr-1" />
          <Text className="text-sm text-gray-600">{department}</Text>
        </View>

        <View className="flex-row">
          <TouchableOpacity
            onPress={handleSendNotification}
            className="bg-blue-50 p-2 rounded-full mr-2"
          >
            <Bell size={18} color="#3b82f6" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleUpdateStatus}
            className="bg-purple-50 p-2 rounded-full mr-2"
          >
            <Edit size={18} color="#8b5cf6" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-50 p-2 rounded-full">
            <ChevronRight size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PatientCard;
