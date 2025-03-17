import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  BarChart3,
  Users,
  Stethoscope,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react-native";

type ResourceType = "staff" | "equipment" | "supplies";

interface ResourceCardProps {
  title?: string;
  type?: ResourceType;
  currentAllocation?: number;
  totalCapacity?: number;
  availabilityPercentage?: number;
  trend?: "up" | "down" | "stable";
  criticalThreshold?: boolean;
  departmentName?: string;
  onAdjust?: (amount: number) => void;
}

const ResourceCard = ({
  title = "Medical Staff",
  type = "staff",
  currentAllocation = 24,
  totalCapacity = 30,
  availabilityPercentage = 80,
  trend = "stable",
  criticalThreshold = false,
  departmentName = "Emergency Department",
  onAdjust = () => {},
}: ResourceCardProps) => {
  const [allocation, setAllocation] = useState(currentAllocation);

  const handleAdjust = (amount: number) => {
    const newAllocation = Math.max(
      0,
      Math.min(totalCapacity, allocation + amount),
    );
    setAllocation(newAllocation);
    onAdjust(newAllocation);
  };

  const getIcon = () => {
    switch (type) {
      case "staff":
        return <Users size={24} color="#4b5563" />;
      case "equipment":
        return <Stethoscope size={24} color="#4b5563" />;
      case "supplies":
        return <Package size={24} color="#4b5563" />;
      default:
        return <BarChart3 size={24} color="#4b5563" />;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp size={18} color="#10b981" />;
      case "down":
        return <TrendingDown size={18} color="#ef4444" />;
      default:
        return null;
    }
  };

  const getAvailabilityColor = () => {
    if (availabilityPercentage >= 70) return "bg-green-500";
    if (availabilityPercentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <View className="w-[380px] h-[220px] bg-white rounded-lg shadow-md p-4 border border-gray-200">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          {getIcon()}
          <Text className="text-lg font-bold ml-2 text-gray-800">{title}</Text>
        </View>
        <View className="flex-row items-center">
          {getTrendIcon()}
          {criticalThreshold && (
            <AlertCircle size={18} color="#ef4444" className="ml-2" />
          )}
        </View>
      </View>

      {/* Department */}
      <Text className="text-sm text-gray-600 mb-3">{departmentName}</Text>

      {/* Allocation Info */}
      <View className="mb-3">
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-600">Current Allocation</Text>
          <Text className="font-semibold">
            {allocation} / {totalCapacity}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className={`h-full ${getAvailabilityColor()}`}
            style={{ width: `${(allocation / totalCapacity) * 100}%` }}
          />
        </View>
      </View>

      {/* Availability */}
      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Availability</Text>
        <View className="flex-row items-center">
          <View
            className={`w-3 h-3 rounded-full ${getAvailabilityColor()} mr-2`}
          />
          <Text className="font-semibold">{availabilityPercentage}%</Text>
        </View>
      </View>

      {/* Adjustment Controls */}
      <View className="flex-row justify-between mt-auto">
        <TouchableOpacity
          className="bg-gray-200 px-4 py-2 rounded-md flex-row items-center justify-center"
          onPress={() => handleAdjust(-1)}
          disabled={allocation <= 0}
        >
          <Text className="font-medium">-</Text>
        </TouchableOpacity>

        <View className="bg-gray-100 px-6 py-2 rounded-md">
          <Text className="font-semibold text-center">{allocation}</Text>
        </View>

        <TouchableOpacity
          className="bg-gray-200 px-4 py-2 rounded-md flex-row items-center justify-center"
          onPress={() => handleAdjust(1)}
          disabled={allocation >= totalCapacity}
        >
          <Text className="font-medium">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResourceCard;
