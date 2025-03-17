import React from "react";
import { View } from "react-native";
import DashboardLayout from "../components/layout/DashboardLayout";
import ResourceAllocation from "../components/dashboard/ResourceAllocation";
import { useAuth } from "../contexts/AuthContext";

export default function ResourcesPage() {
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || "Medical Staff";

  return (
    <DashboardLayout userRole={userRole as any} activePage="resources">
      <ResourceAllocation />
    </DashboardLayout>
  );
}
