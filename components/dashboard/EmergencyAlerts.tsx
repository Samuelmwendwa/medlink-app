import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import {
  AlertTriangle,
  Bell,
  Plus,
  Filter,
  Search,
  X,
  ChevronDown,
  AlertCircle,
  History,
} from "lucide-react-native";
import AlertForm from "./AlertForm";
import ActiveAlertCard from "./ActiveAlertCard";

interface EmergencyAlertsProps {
  activeAlerts?: AlertData[];
  onCreateAlert?: (alertData: AlertData) => void;
  onResolveAlert?: (alertId: string) => void;
  onEscalateAlert?: (alertId: string) => void;
}

interface AlertData {
  id: string;
  type: string;
  location: string;
  timestamp: string;
  severity: "critical" | "high" | "medium" | "low";
  affectedDepartments: string[];
  description: string;
  suggestedActions: string[];
}

const EmergencyAlerts = ({
  activeAlerts = defaultAlerts,
  onCreateAlert = () => {},
  onResolveAlert = () => {},
  onEscalateAlert = () => {},
}: EmergencyAlertsProps) => {
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Alerts");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const filterOptions = [
    "All Alerts",
    "Critical",
    "High",
    "Medium",
    "Low",
    "Code Blue",
    "Fire",
    "Security",
  ];

  const handleCreateAlert = async (alertData: any) => {
    try {
      // Try to save to Supabase if available
      const { supabase } = require("../../lib/supabase");
      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase.from("alerts").insert({
        title: alertData.type,
        description: alertData.description,
        location: alertData.location,
        priority: alertData.severity,
        status: "active",
        created_by: userData?.user?.id || null,
      });

      if (error) {
        console.error("Error saving alert to database:", error);
      }
    } catch (e) {
      console.error("Error in creating alert:", e);
    }

    onCreateAlert(alertData);
    setShowAlertForm(false);
  };

  const handleResolveAlert = (alertId: string) => {
    onResolveAlert(alertId);
  };

  const handleEscalateAlert = (alertId: string) => {
    onEscalateAlert(alertId);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setFilterDropdownOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredAlerts = activeAlerts.filter((alert) => {
    // First apply severity/type filter
    if (selectedFilter !== "All Alerts") {
      const lowerFilter = selectedFilter.toLowerCase();
      if (
        alert.severity !== lowerFilter &&
        !alert.type.toLowerCase().includes(lowerFilter)
      ) {
        return false;
      }
    }

    // Then apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.type.toLowerCase().includes(query) ||
        alert.location.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <View className="w-full h-full bg-gray-50 p-4">
      {/* Header with title and create button */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <AlertTriangle size={24} color="#dc2626" />
          <Text className="text-2xl font-bold ml-2 text-gray-800">
            Emergency Alerts
          </Text>
        </View>
        <TouchableOpacity
          className="bg-red-500 px-4 py-2 rounded-md flex-row items-center"
          onPress={() => setShowAlertForm(true)}
        >
          <Plus size={20} color="#ffffff" />
          <Text className="text-white font-medium ml-1">Create Alert</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs for Active/History */}
      <View className="flex-row mb-4 border-b border-gray-200">
        <TouchableOpacity
          className={`px-4 py-2 ${activeTab === "active" ? "border-b-2 border-red-500" : ""}`}
          onPress={() => setActiveTab("active")}
        >
          <Text
            className={`font-medium ${activeTab === "active" ? "text-red-500" : "text-gray-600"}`}
          >
            Active Alerts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 ${activeTab === "history" ? "border-b-2 border-red-500" : ""}`}
          onPress={() => setActiveTab("history")}
        >
          <Text
            className={`font-medium ${activeTab === "history" ? "text-red-500" : "text-gray-600"}`}
          >
            Alert History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter and Search Bar */}
      <View className="flex-row items-center mb-4 gap-2">
        {/* Filter Dropdown */}
        <View className="relative w-1/4">
          <TouchableOpacity
            className="flex-row items-center justify-between p-2 border border-gray-300 rounded-md bg-white"
            onPress={() => setFilterDropdownOpen(!filterDropdownOpen)}
          >
            <Text className="text-gray-700">{selectedFilter}</Text>
            <ChevronDown size={18} color="#6b7280" />
          </TouchableOpacity>

          {filterDropdownOpen && (
            <View className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-10">
              <ScrollView className="max-h-60">
                {filterOptions.map((filter, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`p-3 ${selectedFilter === filter ? "bg-red-50" : ""}`}
                    onPress={() => handleFilterSelect(filter)}
                  >
                    <Text
                      className={`${selectedFilter === filter ? "text-red-600" : "text-gray-700"}`}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Search Input */}
        <View className="flex-row items-center flex-1 border border-gray-300 rounded-md bg-white px-2">
          <Search size={18} color="#6b7280" />
          <TextInput
            className="flex-1 p-2 text-gray-700"
            placeholder="Search alerts by type, location, description..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <TouchableOpacity className="flex-row items-center bg-gray-200 px-4 py-2 rounded-md">
          <Filter size={18} color="#374151" />
          <Text className="text-gray-700 ml-2">Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Alert Summary Stats */}
      <View className="flex-row mb-4 gap-2">
        <View className="flex-1 bg-red-50 p-3 rounded-md flex-row items-center">
          <AlertCircle size={20} color="#dc2626" />
          <Text className="ml-2 font-medium text-red-700">
            Critical:{" "}
            {activeAlerts.filter((a) => a.severity === "critical").length}
          </Text>
        </View>
        <View className="flex-1 bg-orange-50 p-3 rounded-md flex-row items-center">
          <AlertTriangle size={20} color="#ea580c" />
          <Text className="ml-2 font-medium text-orange-700">
            High: {activeAlerts.filter((a) => a.severity === "high").length}
          </Text>
        </View>
        <View className="flex-1 bg-yellow-50 p-3 rounded-md flex-row items-center">
          <AlertTriangle size={20} color="#ca8a04" />
          <Text className="ml-2 font-medium text-yellow-700">
            Medium: {activeAlerts.filter((a) => a.severity === "medium").length}
          </Text>
        </View>
        <View className="flex-1 bg-blue-50 p-3 rounded-md flex-row items-center">
          <Bell size={20} color="#2563eb" />
          <Text className="ml-2 font-medium text-blue-700">
            Low: {activeAlerts.filter((a) => a.severity === "low").length}
          </Text>
        </View>
      </View>

      {/* Alert List */}
      {activeTab === "active" ? (
        <FlatList
          data={filteredAlerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActiveAlertCard
              id={item.id}
              type={item.type as any}
              location={item.location}
              timestamp={item.timestamp}
              severity={item.severity}
              affectedDepartments={item.affectedDepartments}
              description={item.description}
              suggestedActions={item.suggestedActions}
              onResolve={() => handleResolveAlert(item.id)}
              onEscalate={() => handleEscalateAlert(item.id)}
              onViewDetails={() => console.log("View details for", item.id)}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
              <AlertCircle size={48} color="#9ca3af" />
              <Text className="text-lg font-medium text-gray-500 mt-4">
                No alerts found
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                {searchQuery || selectedFilter !== "All Alerts"
                  ? "Try changing your search or filter criteria"
                  : "There are no active alerts at this time"}
              </Text>
            </View>
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
          <History size={48} color="#9ca3af" />
          <Text className="text-lg font-medium text-gray-500 mt-4">
            Alert History
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Historical alerts would be displayed here
          </Text>
        </View>
      )}

      {/* Alert Form Modal */}
      {showAlertForm && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
          <AlertForm
            onSubmit={handleCreateAlert}
            onCancel={() => setShowAlertForm(false)}
          />
        </View>
      )}
    </View>
  );
};

// Default mock data for alerts
const defaultAlerts: AlertData[] = [
  {
    id: "ALT-2023-0042",
    type: "Code Blue",
    location: "ICU, Floor 3, Room 302",
    timestamp: "2023-06-15 14:32",
    severity: "critical",
    affectedDepartments: ["ICU", "Emergency", "Cardiology"],
    description:
      "Patient experiencing cardiac arrest. Immediate response required.",
    suggestedActions: [
      "Deploy crash cart to location",
      "Notify on-call cardiologist",
      "Clear path to emergency elevator",
    ],
  },
  {
    id: "ALT-2023-0041",
    type: "Fire",
    location: "Laboratory, Floor 2",
    timestamp: "2023-06-15 13:45",
    severity: "high",
    affectedDepartments: ["Laboratory", "Radiology"],
    description:
      "Small chemical fire in lab. Containment procedures initiated.",
    suggestedActions: [
      "Evacuate immediate area",
      "Activate fire suppression system",
      "Notify safety officer",
    ],
  },
  {
    id: "ALT-2023-0040",
    type: "Security",
    location: "Emergency Department, Main Entrance",
    timestamp: "2023-06-15 12:10",
    severity: "medium",
    affectedDepartments: ["Emergency", "Security"],
    description:
      "Disruptive individual in waiting area. Security assistance needed.",
    suggestedActions: [
      "Deploy security personnel",
      "Secure affected area",
      "Prepare incident report",
    ],
  },
  {
    id: "ALT-2023-0039",
    type: "Mass Casualty",
    location: "Emergency Department",
    timestamp: "2023-06-15 10:22",
    severity: "critical",
    affectedDepartments: ["Emergency", "Surgery", "ICU", "Radiology"],
    description:
      "Multiple trauma patients incoming from highway accident. ETA 10 minutes.",
    suggestedActions: [
      "Activate mass casualty protocol",
      "Clear non-critical patients",
      "Call in additional staff",
      "Prepare operating rooms",
    ],
  },
];

export default EmergencyAlerts;
