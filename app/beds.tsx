import React from "react";
import { View } from "react-native";
import DashboardLayout from "../components/layout/DashboardLayout";
import BedManagement from "../components/dashboard/BedManagement";
import { useAuth } from "../contexts/AuthContext";

export default function BedsPage() {
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || "Medical Staff";

  return (
    <DashboardLayout userRole={userRole as any} activePage="beds">
      <BedManagement />
    </DashboardLayout>
  );
}
