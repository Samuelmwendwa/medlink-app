import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

type UserRole = "Administrator" | "Medical Staff" | "Reception";

type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  department?: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data from the profiles table
  async function fetchUserProfile(userId: string) {
    try {
      setIsLoading(true);
      console.log("AuthContext: Fetching profile for user ID:", userId);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("AuthContext: Error fetching user profile:", error);

        // If profile doesn't exist, create a default one
        if (error.code === "PGRST116") {
          console.log(
            "AuthContext: Profile not found, creating default profile",
          );

          // Get user details from auth
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            // Determine role based on email for demo users
            let role = "Medical Staff";
            if (userData.user.email) {
              if (userData.user.email.includes("admin")) {
                role = "Administrator";
              } else if (userData.user.email.includes("reception")) {
                role = "Reception";
              }
            }

            const defaultProfile = {
              id: userId,
              email: userData.user.email || "",
              name: userData.user.user_metadata?.name || "User",
              role: userData.user.user_metadata?.role || role,
              department: userData.user.user_metadata?.department || null,
            };

            console.log("Creating default profile:", defaultProfile);

            // Insert default profile
            const { error: insertError } = await supabase
              .from("profiles")
              .insert([defaultProfile]);

            if (insertError) {
              console.error(
                "AuthContext: Error creating default profile:",
                insertError,
              );
            } else {
              console.log("AuthContext: Default profile created successfully");
              setUserProfile(defaultProfile as UserProfile);
            }
          }
        }
      } else if (data) {
        console.log("AuthContext: Profile fetched successfully:", data.email);
        setUserProfile({
          id: data.id,
          email: data.email,
          role: data.role,
          name: data.name,
          department: data.department,
        });
      }
    } catch (error) {
      console.error("AuthContext: Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("AuthContext: Signing in with", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("AuthContext: Sign in error:", error);
        return { error };
      }

      console.log("AuthContext: Sign in successful, user:", data.user?.id);

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }

      return { error: null };
    } catch (error) {
      console.error("AuthContext: Error signing in:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log("Signing out user...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during sign out:", error);
      } else {
        console.log("User signed out successfully");
        setUserProfile(null);
        // Force navigation to login page
        // We'll handle navigation in the component that calls signOut
      }
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        isLoading,
        signIn,
        signOut,
        isAuthenticated: !!user && !!userProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
