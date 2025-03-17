import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  Users,
  Stethoscope,
  Package,
  Filter,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  BarChart3,
} from "lucide-react-native";
import ResourceCard from "./ResourceCard";

interface ResourceAllocationProps {
  departmentFilter?: string;
  onFilterChange?: (department: string) => void;
  onResourceUpdate?: (resourceId: string, newAllocation: number) => void;
}

const ResourceAllocation = ({
  departmentFilter = "All Departments",
  onFilterChange = () => {},
  onResourceUpdate = () => {},
}: ResourceAllocationProps) => {
  const [activeTab, setActiveTab] = useState<
    "staff" | "equipment" | "supplies"
  >("staff");

  // Mock data for resources
  const staffResources = [
    {
      id: "staff-001",
      title: "Doctors",
      type: "staff",
      currentAllocation: 12,
      totalCapacity: 15,
      availabilityPercentage: 80,
      trend: "stable",
      criticalThreshold: false,
      departmentName: "Emergency Department",
    },
    {
      id: "staff-002",
      title: "Nurses",
      type: "staff",
      currentAllocation: 24,
      totalCapacity: 30,
      availabilityPercentage: 80,
      trend: "down",
      criticalThreshold: false,
      departmentName: "ICU",
    },
    {
      id: "staff-003",
      title: "Specialists",
      type: "staff",
      currentAllocation: 8,
      totalCapacity: 10,
      availabilityPercentage: 80,
      trend: "up",
      criticalThreshold: false,
      departmentName: "Cardiology",
    },
    {
      id: "staff-004",
      title: "Technicians",
      type: "staff",
      currentAllocation: 5,
      totalCapacity: 8,
      availabilityPercentage: 62.5,
      trend: "down",
      criticalThreshold: true,
      departmentName: "Radiology",
    },
    {
      id: "staff-005",
      title: "Support Staff",
      type: "staff",
      currentAllocation: 15,
      totalCapacity: 20,
      availabilityPercentage: 75,
      trend: "stable",
      criticalThreshold: false,
      departmentName: "General Ward",
    },
  ];

  const equipmentResources = [
    {
      id: "equip-001",
      title: "Ventilators",
      type: "equipment",
      currentAllocation: 8,
      totalCapacity: 12,
      availabilityPercentage: 33,
      trend: "down",
      criticalThreshold: true,
      departmentName: "ICU",
    },
    {
      id: "equip-002",
      title: "Monitors",
      type: "equipment",
      currentAllocation: 15,
      totalCapacity: 20,
      availabilityPercentage: 75,
      trend: "stable",
      criticalThreshold: false,
      departmentName: "Emergency Department",
    },
    {
      id: "equip-003",
      title: "Defibrillators",
      type: "equipment",
      currentAllocation: 5,
      totalCapacity: 8,
      availabilityPercentage: 62.5,
      trend: "stable",
      criticalThreshold: false,
      departmentName: "Cardiology",
    },
    {
      id: "equip-004",
      title: "MRI Machines",
      type: "equipment",
      currentAllocation: 1,
      totalCapacity: 2,
      availabilityPercentage: 50,
      trend: "stable",
      criticalThreshold: false,
      departmentName: "Radiology",
    },
  ];

  const suppliesResources = [
    {
      id: "supply-001",
      title: "Medications",
      type: "supplies",
      currentAllocation: 800,
      totalCapacity: 1000,
      availabilityPercentage: 80,
      trend: "stable",
      criticalThreshold: false,
      departmentName: "Pharmacy",
    },
    {
      id: "supply-002",
      title: "PPE",
      type: "supplies",
      currentAllocation: 500,
      totalCapacity: 1000,
      availabilityPercentage: 50,
      trend: "down",
      criticalThreshold: true,
      departmentName: "All Departments",
    },
    {
      id: "supply-003",
      title: "Surgical Supplies",
      type: "supplies",
      currentAllocation: 300,
      totalCapacity: 400,
      availabilityPercentage: 75,
      trend: "stable",
      criticalThreshold: false,
      departmentName: "Surgery",
    },
    {
      id: "supply-004",
      title: "IV Fluids",
      type: "supplies",
      currentAllocation: 200,
      totalCapacity: 300,
      availabilityPercentage: 66,
      trend: "down",
      criticalThreshold: false,
      departmentName: "Emergency Department",
    },
  ];

  // Filter resources based on active tab and department filter
  const getFilteredResources = () => {
    let resources = [];

    switch (activeTab) {
      case "staff":
        resources = staffResources;
        break;
      case "equipment":
        resources = equipmentResources;
        break;
      case "supplies":
        resources = suppliesResources;
        break;
      default:
        resources = staffResources;
    }

    if (departmentFilter !== "All Departments") {
      return resources.filter((r) => r.departmentName === departmentFilter);
    }

    return resources;
  };

  // Department options for filter
  const departments = [
    "All Departments",
    "Emergency Department",
    "ICU",
    "Cardiology",
    "Radiology",
    "General Ward",
    "Surgery",
    "Pharmacy",
  ];

  // Handle resource adjustment
  const handleResourceAdjust = (resourceId: string, newAllocation: number) => {
    onResourceUpdate(resourceId, newAllocation);
    console.log(`Resource ${resourceId} updated to ${newAllocation}`);
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Header with title and summary */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-gray-800">
            Resource Allocation
          </Text>
          <Text className="text-gray-500">
            Manage and distribute hospital resources
          </Text>
        </View>

        <TouchableOpacity className="flex-row items-center bg-blue-100 px-4 py-2 rounded-md">
          <RefreshCw size={18} color="#3b82f6" />
          <Text className="ml-2 text-blue-600 font-medium">Refresh Data</Text>
        </TouchableOpacity>
      </View>

      {/* Resource type tabs */}
      <View className="flex-row bg-white rounded-lg shadow-sm mb-4 p-1">
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-md ${activeTab === "staff" ? "bg-blue-50" : ""}`}
          onPress={() => setActiveTab("staff")}
        >
          <Users
            size={20}
            color={activeTab === "staff" ? "#3b82f6" : "#6b7280"}
          />
          <Text
            className={`ml-2 font-medium ${activeTab === "staff" ? "text-blue-600" : "text-gray-600"}`}
          >
            Staff
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-md ${activeTab === "equipment" ? "bg-blue-50" : ""}`}
          onPress={() => setActiveTab("equipment")}
        >
          <Stethoscope
            size={20}
            color={activeTab === "equipment" ? "#3b82f6" : "#6b7280"}
          />
          <Text
            className={`ml-2 font-medium ${activeTab === "equipment" ? "text-blue-600" : "text-gray-600"}`}
          >
            Equipment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-md ${activeTab === "supplies" ? "bg-blue-50" : ""}`}
          onPress={() => setActiveTab("supplies")}
        >
          <Package
            size={20}
            color={activeTab === "supplies" ? "#3b82f6" : "#6b7280"}
          />
          <Text
            className={`ml-2 font-medium ${activeTab === "supplies" ? "text-blue-600" : "text-gray-600"}`}
          >
            Supplies
          </Text>
        </TouchableOpacity>
      </View>

      {/* Department filter */}
      <View className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Filter size={18} color="#6b7280" />
            <Text className="ml-2 text-gray-700 font-medium">
              Filter by Department
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-1 ml-4"
          >
            <View className="flex-row">
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept}
                  className={`px-4 py-2 rounded-md mr-2 ${departmentFilter === dept ? "bg-blue-500" : "bg-gray-100"}`}
                  onPress={() => onFilterChange(dept)}
                >
                  <Text
                    className={`${departmentFilter === dept ? "text-white" : "text-gray-700"}`}
                  >
                    {dept}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Resource summary */}
      <View className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-gray-800">
            Resource Summary
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <BarChart3 size={18} color="#6b7280" />
            <Text className="ml-1 text-gray-600">View Analytics</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mt-2">
          <View className="bg-blue-50 rounded-lg p-3 flex-1 mr-2">
            <Text className="text-blue-800 font-medium">
              Total{" "}
              {activeTab === "staff"
                ? "Staff"
                : activeTab === "equipment"
                  ? "Equipment"
                  : "Supplies"}
            </Text>
            <Text className="text-2xl font-bold text-blue-600 mt-1">
              {activeTab === "staff"
                ? "75/83"
                : activeTab === "equipment"
                  ? "29/42"
                  : "1800/2700"}
            </Text>
            <Text className="text-blue-600 text-sm">
              {activeTab === "staff"
                ? "90% Allocated"
                : activeTab === "equipment"
                  ? "69% Allocated"
                  : "67% Allocated"}
            </Text>
          </View>

          <View className="bg-yellow-50 rounded-lg p-3 flex-1 mr-2">
            <Text className="text-yellow-800 font-medium">
              Critical Resources
            </Text>
            <Text className="text-2xl font-bold text-yellow-600 mt-1">
              {activeTab === "staff"
                ? "1"
                : activeTab === "equipment"
                  ? "1"
                  : "1"}
            </Text>
            <Text className="text-yellow-600 text-sm">Requires attention</Text>
          </View>

          <View className="bg-green-50 rounded-lg p-3 flex-1">
            <Text className="text-green-800 font-medium">Available</Text>
            <Text className="text-2xl font-bold text-green-600 mt-1">
              {activeTab === "staff"
                ? "8"
                : activeTab === "equipment"
                  ? "13"
                  : "900"}
            </Text>
            <Text className="text-green-600 text-sm">Ready to allocate</Text>
          </View>
        </View>
      </View>

      {/* Resource cards grid */}
      <ScrollView className="flex-1">
        <View className="flex-row flex-wrap justify-between">
          {getFilteredResources().map((resource) => (
            <View key={resource.id} className="mb-4">
              <ResourceCard
                title={resource.title}
                type={resource.type as "staff" | "equipment" | "supplies"}
                currentAllocation={resource.currentAllocation}
                totalCapacity={resource.totalCapacity}
                availabilityPercentage={resource.availabilityPercentage}
                trend={resource.trend as "up" | "down" | "stable"}
                criticalThreshold={resource.criticalThreshold}
                departmentName={resource.departmentName}
                onAdjust={(newAllocation) =>
                  handleResourceAdjust(resource.id, newAllocation)
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Quick action buttons */}
      <View className="flex-row justify-end mt-4 space-x-2">
        <TouchableOpacity className="bg-green-500 p-3 rounded-full">
          <PlusCircle size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-red-500 p-3 rounded-full">
          <MinusCircle size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResourceAllocation;
