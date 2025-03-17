import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Search, Filter, X, ChevronDown } from "lucide-react-native";

interface BedFilterPanelProps {
  onFilterChange?: (filters: {
    ward: string;
    status: string;
    search: string;
  }) => void;
}

const BedFilterPanel = ({ onFilterChange = () => {} }: BedFilterPanelProps) => {
  const [search, setSearch] = useState("");
  const [wardDropdownOpen, setWardDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState("All Wards");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const wards = [
    "All Wards",
    "Emergency",
    "ICU",
    "General",
    "Pediatric",
    "Maternity",
    "Surgery",
    "Psychiatric",
  ];
  const statuses = [
    "All Status",
    "Available",
    "Occupied",
    "Maintenance",
    "Reserved",
    "Cleaning",
  ];

  const handleWardSelect = (ward: string) => {
    setSelectedWard(ward);
    setWardDropdownOpen(false);
    onFilterChange({ ward, status: selectedStatus, search });
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setStatusDropdownOpen(false);
    onFilterChange({ ward: selectedWard, status, search });
  };

  const handleSearchChange = (text: string) => {
    setSearch(text);
    onFilterChange({
      ward: selectedWard,
      status: selectedStatus,
      search: text,
    });
  };

  const clearSearch = () => {
    setSearch("");
    onFilterChange({ ward: selectedWard, status: selectedStatus, search: "" });
  };

  return (
    <View className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <View className="flex-row items-center justify-between">
        {/* Ward Filter Dropdown */}
        <View className="relative w-1/4">
          <TouchableOpacity
            className="flex-row items-center justify-between p-2 border border-gray-300 rounded-md bg-gray-50"
            onPress={() => setWardDropdownOpen(!wardDropdownOpen)}
          >
            <Text className="text-gray-700">{selectedWard}</Text>
            <ChevronDown size={18} color="#6b7280" />
          </TouchableOpacity>

          {wardDropdownOpen && (
            <View className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-10">
              <ScrollView className="max-h-60">
                {wards.map((ward, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`p-3 ${selectedWard === ward ? "bg-blue-50" : ""}`}
                    onPress={() => handleWardSelect(ward)}
                  >
                    <Text
                      className={`${selectedWard === ward ? "text-blue-600" : "text-gray-700"}`}
                    >
                      {ward}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Status Filter Dropdown */}
        <View className="relative w-1/4">
          <TouchableOpacity
            className="flex-row items-center justify-between p-2 border border-gray-300 rounded-md bg-gray-50"
            onPress={() => setStatusDropdownOpen(!statusDropdownOpen)}
          >
            <Text className="text-gray-700">{selectedStatus}</Text>
            <ChevronDown size={18} color="#6b7280" />
          </TouchableOpacity>

          {statusDropdownOpen && (
            <View className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-10">
              <ScrollView className="max-h-60">
                {statuses.map((status, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`p-3 ${selectedStatus === status ? "bg-blue-50" : ""}`}
                    onPress={() => handleStatusSelect(status)}
                  >
                    <Text
                      className={`${selectedStatus === status ? "text-blue-600" : "text-gray-700"}`}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Search Input */}
        <View className="flex-row items-center w-2/5 border border-gray-300 rounded-md bg-gray-50 px-2">
          <Search size={18} color="#6b7280" />
          <TextInput
            className="flex-1 p-2 text-gray-700"
            placeholder="Search by bed ID, patient name..."
            value={search}
            onChangeText={handleSearchChange}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <TouchableOpacity className="flex-row items-center bg-blue-600 px-4 py-2 rounded-md">
          <Filter size={18} color="white" />
          <Text className="text-white ml-2">Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BedFilterPanel;
