import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import {
  Users,
  Plus,
  Search,
  Filter,
  Clock,
  ChevronDown,
  X,
  SortAsc,
  SortDesc,
  RefreshCw,
  AlertCircle,
} from "lucide-react-native";
import PatientCard from "./PatientCard";
import AddPatientForm from "./AddPatientForm";

interface PatientQueueProps {
  patients?: Patient[];
  onAddPatient?: (patient: PatientData) => void;
  onUpdatePatient?: (id: string, updates: Partial<Patient>) => void;
  onSendNotification?: (id: string) => void;
}

interface Patient {
  id: string;
  name: string;
  waitTime: number;
  priority: "low" | "medium" | "high" | "critical";
  department: string;
  arrivalTime: string;
  status: "waiting" | "in-progress" | "completed" | "cancelled";
}

interface PatientData {
  id: string;
  name: string;
  age: string;
  gender: string;
  contactNumber: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  department: string;
  chiefComplaint: string;
  notes: string;
}

const PatientQueue = ({
  patients: initialPatients = [],
  onAddPatient = () => {},
  onUpdatePatient = () => {},
  onSendNotification = () => {},
}: PatientQueueProps) => {
  // State for patients data
  const [patients, setPatients] = useState<Patient[]>(
    initialPatients.length > 0
      ? initialPatients
      : [
          {
            id: "P-12345",
            name: "John Doe",
            waitTime: 45,
            priority: "medium",
            department: "Emergency",
            arrivalTime: "10:30 AM",
            status: "waiting",
          },
          {
            id: "P-12346",
            name: "Jane Smith",
            waitTime: 30,
            priority: "high",
            department: "Cardiology",
            arrivalTime: "10:45 AM",
            status: "waiting",
          },
          {
            id: "P-12347",
            name: "Robert Johnson",
            waitTime: 15,
            priority: "critical",
            department: "Emergency",
            arrivalTime: "11:00 AM",
            status: "in-progress",
          },
          {
            id: "P-12348",
            name: "Emily Davis",
            waitTime: 60,
            priority: "low",
            department: "General Medicine",
            arrivalTime: "10:15 AM",
            status: "waiting",
          },
          {
            id: "P-12349",
            name: "Michael Wilson",
            waitTime: 25,
            priority: "medium",
            department: "Neurology",
            arrivalTime: "10:50 AM",
            status: "waiting",
          },
        ],
  );

  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState<"waitTime" | "priority">("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // State for dropdown visibility
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // State for add patient form
  const [isAddPatientFormVisible, setIsAddPatientFormVisible] = useState(false);

  // Available departments, priorities, and statuses for filtering
  const departments = [
    "All Departments",
    "Emergency",
    "Cardiology",
    "General Medicine",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Obstetrics & Gynecology",
    "Oncology",
  ];

  const priorities = ["All Priorities", "critical", "high", "medium", "low"];

  const statuses = [
    "All Status",
    "waiting",
    "in-progress",
    "completed",
    "cancelled",
  ];

  // Handle adding a new patient
  const handleAddPatient = async (patientData: PatientData) => {
    // Convert the form data to our Patient type
    const newPatient: Patient = {
      id: patientData.id || `P-${Math.floor(Math.random() * 10000)}`,
      name: patientData.name,
      waitTime: Math.floor(Math.random() * 60) + 15, // Random wait time between 15-75 minutes
      priority: patientData.priority.toLowerCase() as
        | "low"
        | "medium"
        | "high"
        | "critical",
      department: patientData.department,
      arrivalTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "waiting",
    };

    try {
      // Try to save to Supabase if available
      const { supabase } = require("../../lib/supabase");
      const { error } = await supabase.from("patients").insert({
        id: newPatient.id,
        name: newPatient.name,
        wait_time: newPatient.waitTime,
        priority: newPatient.priority,
        department: newPatient.department,
        arrival_time: newPatient.arrivalTime,
        status: newPatient.status,
        age: patientData.age,
        gender: patientData.gender,
        contact_number: patientData.contactNumber,
        chief_complaint: patientData.chiefComplaint,
        notes: patientData.notes,
      });

      if (error) {
        console.error("Error saving patient to database:", error);
      }
    } catch (e) {
      console.error("Error in adding patient:", e);
    }

    // Add to local state regardless of database success
    setPatients([...patients, newPatient]);

    // Call the prop callback
    onAddPatient(patientData);
  };

  // Handle updating patient status
  const handleUpdatePatient = (id: string) => {
    // In a real app, this would open a modal to update the patient's status
    console.log(`Update patient status for ${id}`);
    onUpdatePatient(id, {});
  };

  // Handle sending notification to patient
  const handleSendNotification = (id: string) => {
    console.log(`Send notification to patient ${id}`);
    onSendNotification(id);
  };

  // Filter and sort patients
  const filteredAndSortedPatients = patients
    .filter((patient) => {
      // Apply search filter
      if (
        searchQuery &&
        !patient.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !patient.id.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Apply department filter
      if (
        departmentFilter !== "All Departments" &&
        patient.department !== departmentFilter
      ) {
        return false;
      }

      // Apply priority filter
      if (
        priorityFilter !== "All Priorities" &&
        patient.priority !== priorityFilter
      ) {
        return false;
      }

      // Apply status filter
      if (statusFilter !== "All Status" && patient.status !== statusFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === "waitTime") {
        return sortDirection === "asc"
          ? a.waitTime - b.waitTime
          : b.waitTime - a.waitTime;
      } else {
        // Sort by priority (critical > high > medium > low)
        const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
        return sortDirection === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("All Departments");
    setPriorityFilter("All Priorities");
    setStatusFilter("All Status");
  };

  return (
    <View className="w-full h-full bg-gray-50 p-4">
      {/* Header with title and add patient button */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Users size={24} color="#4b5563" className="mr-2" />
          <Text className="text-2xl font-bold text-gray-800">
            Patient Queue
          </Text>
        </View>

        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-md flex-row items-center"
          onPress={() => setIsAddPatientFormVisible(true)}
        >
          <Plus size={20} color="#ffffff" />
          <Text className="text-white font-medium ml-1">Add Patient</Text>
        </TouchableOpacity>
      </View>

      {/* Queue summary */}
      <View className="flex-row mb-4 space-x-4">
        <View className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <Text className="text-sm text-gray-500">Total Patients</Text>
          <Text className="text-2xl font-bold">{patients.length}</Text>
        </View>
        <View className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <Text className="text-sm text-gray-500">Waiting</Text>
          <Text className="text-2xl font-bold">
            {patients.filter((p) => p.status === "waiting").length}
          </Text>
        </View>
        <View className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <Text className="text-sm text-gray-500">In Progress</Text>
          <Text className="text-2xl font-bold">
            {patients.filter((p) => p.status === "in-progress").length}
          </Text>
        </View>
        <View className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <Text className="text-sm text-gray-500">Avg. Wait Time</Text>
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold">
              {Math.round(
                patients.reduce((sum, p) => sum + p.waitTime, 0) /
                  patients.length,
              )}
            </Text>
            <Text className="ml-1 text-gray-500">min</Text>
          </View>
        </View>
      </View>

      {/* Filter and search bar */}
      <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
        <View className="flex-row items-center justify-between">
          {/* Department Filter */}
          <View className="relative w-1/4">
            <TouchableOpacity
              className="flex-row items-center justify-between p-2 border border-gray-300 rounded-md bg-gray-50"
              onPress={() => {
                setDepartmentDropdownOpen(!departmentDropdownOpen);
                setPriorityDropdownOpen(false);
                setStatusDropdownOpen(false);
              }}
            >
              <Text className="text-gray-700">{departmentFilter}</Text>
              <ChevronDown size={18} color="#6b7280" />
            </TouchableOpacity>

            {departmentDropdownOpen && (
              <View className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-10">
                <ScrollView className="max-h-60">
                  {departments.map((dept, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`p-3 ${departmentFilter === dept ? "bg-blue-50" : ""}`}
                      onPress={() => {
                        setDepartmentFilter(dept);
                        setDepartmentDropdownOpen(false);
                      }}
                    >
                      <Text
                        className={`${departmentFilter === dept ? "text-blue-600" : "text-gray-700"}`}
                      >
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Priority Filter */}
          <View className="relative w-1/5">
            <TouchableOpacity
              className="flex-row items-center justify-between p-2 border border-gray-300 rounded-md bg-gray-50"
              onPress={() => {
                setPriorityDropdownOpen(!priorityDropdownOpen);
                setDepartmentDropdownOpen(false);
                setStatusDropdownOpen(false);
              }}
            >
              <Text className="text-gray-700 capitalize">{priorityFilter}</Text>
              <ChevronDown size={18} color="#6b7280" />
            </TouchableOpacity>

            {priorityDropdownOpen && (
              <View className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-10">
                <ScrollView className="max-h-60">
                  {priorities.map((priority, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`p-3 ${priorityFilter === priority ? "bg-blue-50" : ""}`}
                      onPress={() => {
                        setPriorityFilter(priority);
                        setPriorityDropdownOpen(false);
                      }}
                    >
                      <Text
                        className={`capitalize ${priorityFilter === priority ? "text-blue-600" : "text-gray-700"}`}
                      >
                        {priority}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Status Filter */}
          <View className="relative w-1/5">
            <TouchableOpacity
              className="flex-row items-center justify-between p-2 border border-gray-300 rounded-md bg-gray-50"
              onPress={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setDepartmentDropdownOpen(false);
                setPriorityDropdownOpen(false);
              }}
            >
              <Text className="text-gray-700 capitalize">{statusFilter}</Text>
              <ChevronDown size={18} color="#6b7280" />
            </TouchableOpacity>

            {statusDropdownOpen && (
              <View className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-10">
                <ScrollView className="max-h-60">
                  {statuses.map((status, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`p-3 ${statusFilter === status ? "bg-blue-50" : ""}`}
                      onPress={() => {
                        setStatusFilter(status);
                        setStatusDropdownOpen(false);
                      }}
                    >
                      <Text
                        className={`capitalize ${statusFilter === status ? "text-blue-600" : "text-gray-700"}`}
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
          <View className="flex-row items-center w-1/3 border border-gray-300 rounded-md bg-gray-50 px-2">
            <Search size={18} color="#6b7280" />
            <TextInput
              className="flex-1 p-2 text-gray-700"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={18} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sort and filter actions */}
        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center">
            <Text className="text-gray-700 mr-2">Sort by:</Text>
            <TouchableOpacity
              className={`flex-row items-center px-3 py-1 rounded-md mr-2 ${sortBy === "priority" ? "bg-blue-100" : "bg-gray-100"}`}
              onPress={() => setSortBy("priority")}
            >
              <Text
                className={
                  sortBy === "priority" ? "text-blue-700" : "text-gray-700"
                }
              >
                Priority
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center px-3 py-1 rounded-md mr-4 ${sortBy === "waitTime" ? "bg-blue-100" : "bg-gray-100"}`}
              onPress={() => setSortBy("waitTime")}
            >
              <Text
                className={
                  sortBy === "waitTime" ? "text-blue-700" : "text-gray-700"
                }
              >
                Wait Time
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center"
              onPress={toggleSortDirection}
            >
              {sortDirection === "asc" ? (
                <SortAsc size={20} color="#6b7280" />
              ) : (
                <SortDesc size={20} color="#6b7280" />
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              className="flex-row items-center mr-2 px-3 py-1 rounded-md bg-gray-100"
              onPress={clearFilters}
            >
              <RefreshCw size={16} color="#6b7280" className="mr-1" />
              <Text className="text-gray-700">Clear Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center px-3 py-1 rounded-md bg-blue-500">
              <Filter size={16} color="#ffffff" className="mr-1" />
              <Text className="text-white">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Patient list */}
      <ScrollView className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
        <View className="p-4">
          {filteredAndSortedPatients.length > 0 ? (
            filteredAndSortedPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                id={patient.id}
                name={patient.name}
                waitTime={patient.waitTime}
                priority={patient.priority}
                department={patient.department}
                onUpdateStatus={() => handleUpdatePatient(patient.id)}
                onSendNotification={() => handleSendNotification(patient.id)}
              />
            ))
          ) : (
            <View className="py-8 items-center">
              <AlertCircle size={40} color="#9ca3af" />
              <Text className="text-gray-500 mt-2 text-center">
                No patients match your filters
              </Text>
              <TouchableOpacity
                className="mt-4 px-4 py-2 bg-gray-100 rounded-md"
                onPress={clearFilters}
              >
                <Text className="text-gray-700">Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Patient Form Modal */}
      <AddPatientForm
        isVisible={isAddPatientFormVisible}
        onClose={() => setIsAddPatientFormVisible(false)}
        onSubmit={handleAddPatient}
      />
    </View>
  );
};

export default PatientQueue;
