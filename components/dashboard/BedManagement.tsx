import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { PlusCircle, RefreshCw, Grid, List } from "lucide-react-native";

import BedStatusCard from "./BedStatusCard";
import BedFilterPanel from "./BedFilterPanel";

type BedStatus = "Available" | "Occupied" | "Maintenance";

interface Bed {
  id: string;
  status: BedStatus;
  department: string;
  patientName?: string;
  admissionTime?: string;
}

interface BedManagementProps {
  beds?: Bed[];
  onStatusChange?: (id: string, newStatus: BedStatus) => void;
  onAddBed?: () => void;
}

const BedManagement = ({
  beds: initialBeds,
  onStatusChange = () => {},
  onAddBed = () => {},
}: BedManagementProps) => {
  // Generate mock data if no beds are provided
  const generateMockBeds = (): Bed[] => {
    const departments = [
      "Emergency",
      "ICU",
      "General Ward",
      "Pediatric",
      "Maternity",
      "Surgery",
      "Psychiatric",
    ];
    const statuses: BedStatus[] = ["Available", "Occupied", "Maintenance"];
    const mockBeds: Bed[] = [];

    for (let i = 1; i <= 24; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const department =
        departments[Math.floor(Math.random() * departments.length)];
      const bed: Bed = {
        id: `B-${1000 + i}`,
        status,
        department,
      };

      if (status === "Occupied") {
        bed.patientName = [
          "John Doe",
          "Jane Smith",
          "Robert Johnson",
          "Maria Garcia",
        ][Math.floor(Math.random() * 4)];
        bed.admissionTime = ["08:30 AM", "11:45 AM", "02:15 PM", "07:20 PM"][
          Math.floor(Math.random() * 4)
        ];
      }

      mockBeds.push(bed);
    }

    return mockBeds;
  };

  const [beds, setBeds] = useState<Bed[]>(initialBeds || generateMockBeds());
  const [filteredBeds, setFilteredBeds] = useState<Bed[]>(beds);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Apply filters when beds change
  useEffect(() => {
    setFilteredBeds(beds);
  }, [beds]);

  // Handle bed status change
  const handleStatusChange = (id: string, newStatus: BedStatus) => {
    const updatedBeds = beds.map((bed) => {
      if (bed.id === id) {
        const updatedBed = { ...bed, status: newStatus };
        // Clear patient info if bed becomes available
        if (newStatus === "Available") {
          delete updatedBed.patientName;
          delete updatedBed.admissionTime;
        }
        // Add default patient info if bed becomes occupied and doesn't have patient info
        if (newStatus === "Occupied" && !updatedBed.patientName) {
          updatedBed.patientName = "New Patient";
          updatedBed.admissionTime = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
        return updatedBed;
      }
      return bed;
    });

    setBeds(updatedBeds);
    onStatusChange(id, newStatus);
  };

  // Handle filter changes
  const handleFilterChange = (filters: {
    ward: string;
    status: string;
    search: string;
  }) => {
    let filtered = [...beds];

    // Filter by ward
    if (filters.ward !== "All Wards") {
      filtered = filtered.filter((bed) => bed.department === filters.ward);
    }

    // Filter by status
    if (filters.status !== "All Status") {
      filtered = filtered.filter((bed) => bed.status === filters.status);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (bed) =>
          bed.id.toLowerCase().includes(searchLower) ||
          (bed.patientName &&
            bed.patientName.toLowerCase().includes(searchLower)) ||
          bed.department.toLowerCase().includes(searchLower),
      );
    }

    setFilteredBeds(filtered);
  };

  // Handle refresh - actually fetch data from Supabase
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Try to fetch from Supabase if available
      const { supabase } = require("../../lib/supabase");
      const { data, error } = await supabase.from("beds").select("*");

      if (error) {
        console.error("Error fetching beds:", error);
        // Fall back to mock data
        setBeds(generateMockBeds());
      } else if (data && data.length > 0) {
        // Map the data to our Bed type
        const fetchedBeds = data.map((bed) => ({
          id: bed.id,
          status: bed.status as BedStatus,
          department: bed.department,
          patientName: bed.patient_name,
          admissionTime: bed.admission_time,
        }));
        setBeds(fetchedBeds);
      } else {
        // No data, use mock data
        setBeds(generateMockBeds());
      }
    } catch (e) {
      console.error("Error in refresh:", e);
      // Fall back to mock data
      setBeds(generateMockBeds());
    } finally {
      setRefreshing(false);
    }
  };

  // Get counts for summary
  const getStatusCounts = () => {
    const counts = {
      total: beds.length,
      available: beds.filter((bed) => bed.status === "Available").length,
      occupied: beds.filter((bed) => bed.status === "Occupied").length,
      maintenance: beds.filter((bed) => bed.status === "Maintenance").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Summary Stats */}
      <View className="flex-row mb-4 space-x-3">
        <View className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <Text className="text-sm text-gray-500">Total Beds</Text>
          <Text className="text-2xl font-bold">{statusCounts.total}</Text>
        </View>
        <View className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <Text className="text-sm text-gray-500">Available</Text>
          <Text className="text-2xl font-bold text-green-600">
            {statusCounts.available}
          </Text>
        </View>
        <View className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <Text className="text-sm text-gray-500">Occupied</Text>
          <Text className="text-2xl font-bold text-red-600">
            {statusCounts.occupied}
          </Text>
        </View>
        <View className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <Text className="text-sm text-gray-500">Maintenance</Text>
          <Text className="text-2xl font-bold text-yellow-600">
            {statusCounts.maintenance}
          </Text>
        </View>
      </View>

      {/* Filter Panel */}
      <View className="mb-4">
        <BedFilterPanel onFilterChange={handleFilterChange} />
      </View>

      {/* Action Bar */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-800">
          {filteredBeds.length} Beds
        </Text>
        <View className="flex-row space-x-2">
          {/* View Mode Toggle */}
          <View className="flex-row bg-gray-200 rounded-md overflow-hidden">
            <TouchableOpacity
              className={`px-3 py-2 ${viewMode === "grid" ? "bg-blue-500" : ""}`}
              onPress={() => setViewMode("grid")}
            >
              <Grid
                size={20}
                color={viewMode === "grid" ? "#ffffff" : "#6b7280"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-3 py-2 ${viewMode === "list" ? "bg-blue-500" : ""}`}
              onPress={() => setViewMode("list")}
            >
              <List
                size={20}
                color={viewMode === "list" ? "#ffffff" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>

          {/* Refresh Button */}
          <TouchableOpacity
            className="bg-gray-200 px-3 py-2 rounded-md"
            onPress={onRefresh}
          >
            <RefreshCw size={20} color="#6b7280" />
          </TouchableOpacity>

          {/* Add Bed Button */}
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-md flex-row items-center"
            onPress={onAddBed}
          >
            <PlusCircle size={20} color="#ffffff" />
            <Text className="text-white font-medium ml-2">Add Bed</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Beds Grid/List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBeds.length > 0 ? (
          <View
            className={`flex-1 ${viewMode === "grid" ? "flex-row flex-wrap" : ""}`}
          >
            {filteredBeds.map((bed) => (
              <View
                key={bed.id}
                className={`${viewMode === "grid" ? "p-2" : "mb-3"}`}
              >
                <BedStatusCard
                  id={bed.id}
                  status={bed.status}
                  department={bed.department}
                  patientName={bed.patientName}
                  admissionTime={bed.admissionTime}
                  onStatusChange={handleStatusChange}
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-10">
            <Text className="text-gray-500 text-lg">
              No beds match your filters
            </Text>
            <TouchableOpacity
              className="mt-4 bg-blue-500 px-4 py-2 rounded-md"
              onPress={() => setFilteredBeds(beds)}
            >
              <Text className="text-white">Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BedManagement;
