import { supabase } from "./supabase";
import * as SecureStore from "expo-secure-store";
import { Session } from "@supabase/supabase-js";

export type UserRole = "admin" | "medical" | "reception";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  department?: string;
}

// Save session to secure storage
export async function saveSession(session: Session) {
  try {
    await SecureStore.setItemAsync("session", JSON.stringify(session));
    return true;
  } catch (error) {
    console.error("Error saving session:", error);
    return false;
  }
}

// Get session from secure storage
export async function getSession(): Promise<Session | null> {
  try {
    const sessionStr = await SecureStore.getItemAsync("session");
    if (sessionStr) {
      return JSON.parse(sessionStr);
    }
    return null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Clear session from secure storage
export async function clearSession() {
  try {
    await SecureStore.deleteItemAsync("session");
    return true;
  } catch (error) {
    console.error("Error clearing session:", error);
    return false;
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (data?.session) {
      await saveSession(data.session);
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    await clearSession();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Get current user profile
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// Register a new user (admin only function)
export async function registerUser({
  email,
  password,
  full_name,
  role,
  department,
}: {
  email: string;
  password: string;
  full_name?: string;
  role: UserRole;
  department?: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke("create-user", {
      body: { email, password, full_name, role, department },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
