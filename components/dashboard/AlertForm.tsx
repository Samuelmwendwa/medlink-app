import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  AlertCircle,
  Bell,
  Building2,
  MapPin,
  AlertTriangle,
  Send,
} from "lucide-react-native";

interface AlertFormProps {
  onSubmit?: (alertData: AlertData) => void;
  onCancel?: () => void;
}

interface AlertData {
  type: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  departments: string[];
}

const AlertForm = ({ onSubmit, onCancel }: AlertFormProps = {}) => {
  const [alertData, setAlertData] = useState<AlertData>({
    type: "",
    location: "",
    severity: "medium",
    description: "",
    departments: [],
  });

  const availableDepartments = [
    "Emergency Room",
    "ICU",
    "Surgery",
    "Pediatrics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
  ];

  const alertTypes = [
    "Medical Emergency",
    "Staff Shortage",
    "Equipment Failure",
    "Capacity Overflow",
    "Security Incident",
    "Facility Issue",
  ];

  const handleDepartmentToggle = (dept: string) => {
    setAlertData((prev) => {
      if (prev.departments.includes(dept)) {
        return {
          ...prev,
          departments: prev.departments.filter((d) => d !== dept),
        };
      } else {
        return {
          ...prev,
          departments: [...prev.departments, dept],
        };
      }
    });
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(alertData);
    }
    // For demo purposes, log the data
    console.log("Alert submitted:", alertData);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <View className="bg-white p-6 rounded-lg shadow-md w-full max-w-[600px] h-[500px]">
      <View className="flex-row items-center mb-6">
        <AlertCircle size={24} color="#dc2626" />
        <Text className="text-2xl font-bold ml-2 text-gray-800">
          Create Emergency Alert
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Alert Type Selection */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-gray-700">
            Alert Type
          </Text>
          <View className="flex-row flex-wrap">
            {alertTypes.map((type) => (
              <TouchableOpacity
                key={type}
                className={`mr-2 mb-2 px-3 py-2 rounded-full ${alertData.type === type ? "bg-red-500" : "bg-gray-200"}`}
                onPress={() => setAlertData({ ...alertData, type })}
              >
                <Text
                  className={`text-sm ${alertData.type === type ? "text-white" : "text-gray-800"}`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-gray-700">
            Location
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
            <MapPin size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Specify location"
              value={alertData.location}
              onChangeText={(location) =>
                setAlertData({ ...alertData, location })
              }
            />
          </View>
        </View>

        {/* Severity Selection */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-gray-700">
            Severity
          </Text>
          <View className="flex-row">
            {(["low", "medium", "high", "critical"] as const).map((level) => (
              <TouchableOpacity
                key={level}
                className={`flex-1 mr-2 py-2 rounded-md flex-row justify-center items-center ${getSeverityColor(level, alertData.severity)}`}
                onPress={() => setAlertData({ ...alertData, severity: level })}
              >
                <AlertTriangle
                  size={16}
                  color={level === alertData.severity ? "#ffffff" : "#374151"}
                />
                <Text
                  className={`ml-1 text-sm ${level === alertData.severity ? "text-white font-medium" : "text-gray-800"}`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-gray-700">
            Description
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md px-3 py-2 text-gray-800 min-h-[80px]"
            placeholder="Provide details about the emergency"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={alertData.description}
            onChangeText={(description) =>
              setAlertData({ ...alertData, description })
            }
          />
        </View>

        {/* Departments to Notify */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2 text-gray-700">
            Departments to Notify
          </Text>
          <View className="flex-row flex-wrap">
            {availableDepartments.map((dept) => (
              <TouchableOpacity
                key={dept}
                className={`mr-2 mb-2 px-3 py-2 rounded-full flex-row items-center ${alertData.departments.includes(dept) ? "bg-blue-500" : "bg-gray-200"}`}
                onPress={() => handleDepartmentToggle(dept)}
              >
                <Building2
                  size={16}
                  color={
                    alertData.departments.includes(dept) ? "#ffffff" : "#374151"
                  }
                />
                <Text
                  className={`ml-1 text-sm ${alertData.departments.includes(dept) ? "text-white" : "text-gray-800"}`}
                >
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row justify-end mt-4 pt-4 border-t border-gray-200">
        <TouchableOpacity
          className="px-4 py-2 rounded-md bg-gray-200 mr-2"
          onPress={handleCancel}
        >
          <Text className="text-gray-800 font-medium">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 rounded-md bg-red-500 flex-row items-center"
          onPress={handleSubmit}
        >
          <Bell size={18} color="#ffffff" />
          <Text className="text-white font-medium ml-1">Trigger Alert</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getSeverityColor = (level: string, selected: string) => {
  if (level !== selected) return "bg-gray-200";

  switch (level) {
    case "low":
      return "bg-yellow-500";
    case "medium":
      return "bg-orange-500";
    case "high":
      return "bg-red-500";
    case "critical":
      return "bg-purple-700";
    default:
      return "bg-gray-200";
  }
};

export default AlertForm;
