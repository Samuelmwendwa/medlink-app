import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

type SettingsContextType = {
  hospitalName: string;
  notificationsEnabled: boolean;
  autoLogout: boolean;
  darkMode: boolean;
  setHospitalName: (name: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAutoLogout: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  saveSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { userProfile } = useAuth();
  const [hospitalName, setHospitalName] = useState("City Hospital");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load settings from database when user profile is available
  useEffect(() => {
    if (userProfile?.id) {
      loadSettings();
    }
  }, [userProfile?.id]);

  const loadSettings = async () => {
    try {
      if (!userProfile?.id) return;

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userProfile.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading settings:", error);
        return;
      }

      if (data) {
        setHospitalName(data.hospital_name || "City Hospital");
        setNotificationsEnabled(data.notifications_enabled !== false);
        setAutoLogout(data.auto_logout !== false);
        setDarkMode(data.dark_mode === true);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      if (!userProfile?.id) return;

      const settings = {
        user_id: userProfile.id,
        hospital_name: hospitalName,
        notifications_enabled: notificationsEnabled,
        auto_logout: autoLogout,
        dark_mode: darkMode,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("user_settings")
        .upsert(settings)
        .select();

      if (error) {
        console.error("Error saving settings:", error);
        throw error;
      }

      console.log("Settings saved successfully:", data);
      return data;
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        hospitalName,
        notificationsEnabled,
        autoLogout,
        darkMode,
        setHospitalName,
        setNotificationsEnabled,
        setAutoLogout,
        setDarkMode,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
