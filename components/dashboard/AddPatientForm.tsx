import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import {
  X,
  Plus,
  Clock,
  User,
  FileText,
  AlertCircle,
} from "lucide-react-native";

interface PatientFormProps {
  isVisible?: boolean;
  onClose?: () => void;
  onSubmit?: (patientData: PatientData) => void;
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

const priorityColors = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-blue-100 text-blue-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

const departments = [
  "Emergency",
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Obstetrics & Gynecology",
  "Oncology",
];

const AddPatientForm = ({
  isVisible = true,
  onClose = () => {},
  onSubmit = () => {},
}: PatientFormProps) => {
  const [patientData, setPatientData] = useState<PatientData>({
    id: `P${Math.floor(100000 + Math.random() * 900000)}`,
    name: "",
    age: "",
    gender: "",
    contactNumber: "",
    priority: "Medium",
    department: "Emergency",
    chiefComplaint: "",
    notes: "",
  });

  const handleChange = (field: keyof PatientData, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // In a real app, we would validate the form here
    onSubmit(patientData);
    onClose();
    // Reset form
    setPatientData({
      id: `P${Math.floor(100000 + Math.random() * 900000)}`,
      name: "",
      age: "",
      gender: "",
      contactNumber: "",
      priority: "Medium",
      department: "Emergency",
      chiefComplaint: "",
      notes: "",
    });
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-[500px] max-h-[600px] rounded-lg shadow-xl">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Add New Patient to Queue</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView className="p-4">
            {/* Patient ID */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Patient ID
              </Text>
              <View className="flex-row items-center bg-gray-100 p-2 rounded-md">
                <FileText size={20} color="#6b7280" />
                <Text className="ml-2 text-gray-500">{patientData.id}</Text>
              </View>
            </View>

            {/* Patient Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Patient Name*
              </Text>
              <View className="flex-row items-center border border-gray-300 p-2 rounded-md">
                <User size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Enter patient name"
                  value={patientData.name}
                  onChangeText={(text) => handleChange("name", text)}
                />
              </View>
            </View>

            {/* Patient Details Row */}
            <View className="flex-row mb-4 space-x-2">
              {/* Age */}
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Age
                </Text>
                <TextInput
                  className="border border-gray-300 p-2 rounded-md text-base"
                  placeholder="Age"
                  keyboardType="numeric"
                  value={patientData.age}
                  onChangeText={(text) => handleChange("age", text)}
                />
              </View>

              {/* Gender */}
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Gender
                </Text>
                <View className="flex-row space-x-2">
                  {["Male", "Female", "Other"].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      className={`flex-1 p-2 rounded-md ${patientData.gender === gender ? "bg-blue-100 border border-blue-500" : "bg-gray-100"}`}
                      onPress={() => handleChange("gender", gender)}
                    >
                      <Text
                        className={`text-center ${patientData.gender === gender ? "text-blue-700" : "text-gray-700"}`}
                      >
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Contact Number */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </Text>
              <TextInput
                className="border border-gray-300 p-2 rounded-md text-base"
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                value={patientData.contactNumber}
                onChangeText={(text) => handleChange("contactNumber", text)}
              />
            </View>

            {/* Priority Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Priority*
              </Text>
              <View className="flex-row space-x-2">
                {["Low", "Medium", "High", "Critical"].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    className={`flex-1 p-2 rounded-md ${
                      patientData.priority === priority
                        ? priorityColors[
                            priority as keyof typeof priorityColors
                          ].split(" ")[0]
                        : "bg-gray-100"
                    }`}
                    onPress={() =>
                      handleChange(
                        "priority",
                        priority as "Low" | "Medium" | "High" | "Critical",
                      )
                    }
                  >
                    <Text
                      className={`text-center ${
                        patientData.priority === priority
                          ? priorityColors[
                              priority as keyof typeof priorityColors
                            ].split(" ")[1]
                          : "text-gray-700"
                      }`}
                    >
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Department Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Department*
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-2"
              >
                <View className="flex-row space-x-2">
                  {departments.map((dept) => (
                    <TouchableOpacity
                      key={dept}
                      className={`px-4 py-2 rounded-md ${patientData.department === dept ? "bg-purple-100 border border-purple-500" : "bg-gray-100"}`}
                      onPress={() => handleChange("department", dept)}
                    >
                      <Text
                        className={`${patientData.department === dept ? "text-purple-700" : "text-gray-700"}`}
                      >
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Chief Complaint */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Chief Complaint*
              </Text>
              <View className="flex-row items-start border border-gray-300 p-2 rounded-md">
                <AlertCircle
                  size={20}
                  color="#6b7280"
                  style={{ marginTop: 2 }}
                />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Enter chief complaint"
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  value={patientData.chiefComplaint}
                  onChangeText={(text) => handleChange("chiefComplaint", text)}
                />
              </View>
            </View>

            {/* Additional Notes */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </Text>
              <TextInput
                className="border border-gray-300 p-2 rounded-md text-base"
                placeholder="Enter any additional notes"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={patientData.notes}
                onChangeText={(text) => handleChange("notes", text)}
              />
            </View>

            {/* Estimated Wait Time */}
            <View className="mb-4 bg-blue-50 p-3 rounded-md flex-row items-center">
              <Clock size={20} color="#3b82f6" />
              <Text className="ml-2 text-blue-700">
                Estimated wait time:{" "}
                <Text className="font-bold">45-60 minutes</Text>
              </Text>
            </View>
          </ScrollView>

          {/* Footer with Actions */}
          <View className="p-4 border-t border-gray-200 flex-row justify-end space-x-2">
            <TouchableOpacity
              className="px-4 py-2 rounded-md bg-gray-200"
              onPress={onClose}
            >
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 rounded-md bg-blue-500 flex-row items-center"
              onPress={handleSubmit}
            >
              <Plus size={20} color="#ffffff" />
              <Text className="text-white font-medium ml-1">Add Patient</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddPatientForm;
