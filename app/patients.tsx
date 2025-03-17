import React from "react";
import { View } from "react-native";
import DashboardLayout from "../components/layout/DashboardLayout";
import PatientQueue from "../components/dashboard/PatientQueue";
import { useAuth } from "../contexts/AuthContext";

export default function PatientsPage() {
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || "Medical Staff";

  return (
    <DashboardLayout userRole={userRole as any} activePage="patients">
      <PatientQueue />
    </DashboardLayout>
  );
}
