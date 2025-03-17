import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Bed, User, Clock, MoreHorizontal } from "lucide-react-native";

type BedStatus = "Available" | "Occupied" | "Maintenance";

interface BedStatusCardProps {
  id: string;
  status: BedStatus;
  department: string;
  patientName?: string;
  admissionTime?: string;
  onStatusChange?: (id: string, newStatus: BedStatus) => void;
}

const BedStatusCard = ({
  id,
  status,
  department,
  patientName,
  admissionTime,
  onStatusChange = () => {},
}: BedStatusCardProps) => {
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case "Available":
        return "bg-green-100 border-green-300 text-green-800";
      case "Occupied":
        return "bg-red-100 border-red-300 text-red-800";
      case "Maintenance":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: BedStatus) => {
    try {
      // Try to update in Supabase if available
      const { supabase } = require("../../lib/supabase");
      const { error } = await supabase
        .from("beds")
        .update({
          status: newStatus,
          // Clear patient info if bed becomes available
          ...(newStatus === "Available"
            ? { patient_name: null, admission_time: null }
            : {}),
          // Add default patient info if bed becomes occupied
          ...(newStatus === "Occupied" && !patientName
            ? {
                patient_name: "New Patient",
                admission_time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : {}),
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating bed status:", error);
      }
    } catch (e) {
      console.error("Error in status change:", e);
    }

    // Update local state regardless of database success
    onStatusChange(id, newStatus);
  };

  return (
    <View
      className={`w-full md:w-[280px] h-[180px] ${getStatusColor()} rounded-lg border p-4 flex-col justify-between`}
    >
      {/* Header with ID and Department */}
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center">
          <Bed size={18} color="#4b5563" />
          <Text className="ml-2 font-bold text-gray-800">{id}</Text>
        </View>
        <View className="bg-white/50 px-2 py-1 rounded">
          <Text className="text-xs font-medium">{department}</Text>
        </View>
      </View>

      {/* Status */}
      <View className="my-2">
        <Text className="text-lg font-bold capitalize">{status}</Text>
      </View>

      {/* Patient Info (if occupied) */}
      {status === "Occupied" && patientName && (
        <View className="bg-white/50 rounded-md p-2">
          <View className="flex-row items-center">
            <User size={16} color="#4b5563" />
            <Text className="ml-1 font-medium text-gray-800">
              {patientName}
            </Text>
          </View>
          {admissionTime && (
            <View className="flex-row items-center mt-1">
              <Clock size={14} color="#6b7280" />
              <Text className="ml-1 text-xs text-gray-600">
                Since {admissionTime}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-2">
        {status !== "Available" && (
          <TouchableOpacity
            className="bg-green-500 px-2 py-1 rounded flex-1 mr-1 items-center"
            onPress={() => handleStatusChange("Available")}
          >
            <Text className="text-white text-xs">Available</Text>
          </TouchableOpacity>
        )}

        {status !== "Occupied" && (
          <TouchableOpacity
            className="bg-red-500 px-2 py-1 rounded flex-1 mr-1 items-center"
            onPress={() => handleStatusChange("Occupied")}
          >
            <Text className="text-white text-xs">Occupied</Text>
          </TouchableOpacity>
        )}

        {status !== "Maintenance" && (
          <TouchableOpacity
            className="bg-yellow-500 px-2 py-1 rounded flex-1 items-center"
            onPress={() => handleStatusChange("Maintenance")}
          >
            <Text className="text-white text-xs">Maintenance</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity className="bg-gray-200 p-1 rounded ml-1">
          <MoreHorizontal size={16} color="#4b5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BedStatusCard;
