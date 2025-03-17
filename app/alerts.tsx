import React from "react";
import { View } from "react-native";
import DashboardLayout from "../components/layout/DashboardLayout";
import EmergencyAlerts from "../components/dashboard/EmergencyAlerts";
import { useAuth } from "../contexts/AuthContext";

export default function AlertsPage() {
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || "Medical Staff";

  return (
    <DashboardLayout userRole={userRole as any} activePage="alerts">
      <EmergencyAlerts />
    </DashboardLayout>
  );
}
