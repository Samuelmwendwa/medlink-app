import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react-native";

interface ActiveAlertCardProps {
  id?: string;
  type?: "Code Blue" | "Fire" | "Security" | "Mass Casualty";
  location?: string;
  timestamp?: string;
  severity?: "critical" | "high" | "medium" | "low";
  affectedDepartments?: string[];
  description?: string;
  suggestedActions?: string[];
  onResolve?: () => void;
  onEscalate?: () => void;
  onViewDetails?: () => void;
}

const ActiveAlertCard = ({
  id = "ALT-2023-0042",
  type = "Code Blue",
  location = "ICU, Floor 3, Room 302",
  timestamp = "2023-06-15 14:32",
  severity = "critical",
  affectedDepartments = ["ICU", "Emergency", "Cardiology"],
  description = "Patient experiencing cardiac arrest. Immediate response required.",
  suggestedActions = [
    "Deploy crash cart to location",
    "Notify on-call cardiologist",
    "Clear path to emergency elevator",
  ],
  onResolve = () => console.log("Alert resolved"),
  onEscalate = () => console.log("Alert escalated"),
  onViewDetails = () => console.log("View alert details"),
}: ActiveAlertCardProps) => {
  // Determine severity color
  const getSeverityColor = () => {
    switch (severity) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-red-600";
    }
  };

  // Determine alert icon based on type
  const getAlertIcon = () => {
    switch (type) {
      case "Code Blue":
        return <AlertCircle size={24} color="#ffffff" />;
      case "Fire":
        return <AlertTriangle size={24} color="#ffffff" />;
      case "Security":
        return <AlertTriangle size={24} color="#ffffff" />;
      case "Mass Casualty":
        return <AlertTriangle size={24} color="#ffffff" />;
      default:
        return <AlertCircle size={24} color="#ffffff" />;
    }
  };

  const handleResolve = async () => {
    try {
      // Try to update in Supabase if available
      const { supabase } = require("../../lib/supabase");
      const { error } = await supabase
        .from("alerts")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error("Error resolving alert:", error);
      }
    } catch (e) {
      console.error("Error in resolving alert:", e);
    }

    onResolve();
  };

  const handleEscalate = () => {
    onEscalate();
  };

  const handleViewDetails = () => {
    onViewDetails();
  };

  return (
    <View
      className={`w-full bg-white border border-gray-200 rounded-lg shadow-md mb-4 overflow-hidden`}
    >
      {/* Alert Header */}
      <View
        className={`flex-row items-center justify-between p-4 ${getSeverityColor()}`}
      >
        <View className="flex-row items-center">
          <View className="bg-white/20 rounded-full p-2 mr-3">
            {getAlertIcon()}
          </View>
          <View>
            <Text className="text-white font-bold text-lg">{type}</Text>
            <Text className="text-white opacity-90">{id}</Text>
          </View>
        </View>
        <View className="bg-white/20 rounded-full px-3 py-1">
          <Text className="text-white font-bold uppercase text-sm">
            {severity}
          </Text>
        </View>
      </View>

      {/* Alert Details */}
      <View className="p-4">
        <View className="flex-row items-start mb-3">
          <MapPin size={18} color="#6b7280" className="mr-2" />
          <Text className="text-gray-700 flex-1">{location}</Text>
          <Clock size={18} color="#6b7280" className="mr-2" />
          <Text className="text-gray-700">{timestamp}</Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Users size={18} color="#6b7280" className="mr-2" />
          <Text className="text-gray-700 mr-2">Affected:</Text>
          <View className="flex-row flex-wrap">
            {affectedDepartments.map((dept, index) => (
              <View
                key={index}
                className="bg-gray-100 rounded-full px-2 py-1 mr-2 mb-1"
              >
                <Text className="text-gray-700 text-xs">{dept}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text className="text-gray-800 mb-3">{description}</Text>

        {/* Suggested Actions */}
        <View className="bg-blue-50 p-3 rounded-md mb-3">
          <Text className="font-bold text-blue-800 mb-2">
            Suggested Actions:
          </Text>
          {suggestedActions.map((action, index) => (
            <View key={index} className="flex-row items-center mb-1">
              <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
              <Text className="text-blue-800">{action}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            onPress={handleResolve}
            className="flex-row items-center justify-center bg-green-500 rounded-md py-2 px-4"
          >
            <CheckCircle size={18} color="#ffffff" className="mr-2" />
            <Text className="text-white font-bold">Resolve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEscalate}
            className="flex-row items-center justify-center bg-red-500 rounded-md py-2 px-4"
          >
            <AlertTriangle size={18} color="#ffffff" className="mr-2" />
            <Text className="text-white font-bold">Escalate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleViewDetails}
            className="flex-row items-center justify-center bg-gray-200 rounded-md py-2 px-4"
          >
            <Text className="text-gray-800 font-bold mr-1">Details</Text>
            <ArrowRight size={18} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ActiveAlertCard;
