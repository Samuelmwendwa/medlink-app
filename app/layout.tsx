import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform, View, Text } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { SettingsProvider } from "../contexts/SettingsContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  // Set initial route to login
  const initialRouteName = "auth/login";
  const { userProfile, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    console.log(
      "_layout: Auth state changed - isAuthenticated:",
      !!userProfile,
    );
    const inAuthGroup = segments[0] === "auth";
    console.log(
      "_layout: Current route group:",
      segments[0],
      "inAuthGroup:",
      inAuthGroup,
    );

    if (!userProfile && !inAuthGroup) {
      // Redirect to login if not authenticated and not already in auth group
      console.log("_layout: Not authenticated, redirecting to login");
      router.replace("/auth/login");
    } else if (userProfile && inAuthGroup) {
      // Redirect to home if authenticated but still in auth group
      console.log(
        "_layout: Authenticated but in auth group, redirecting to dashboard",
      );
      router.replace("/");
    }
  }, [userProfile, segments, isLoading]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        initialRouteName={initialRouteName}
        screenOptions={({ route }) => ({
          headerShown: false,
        })}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            // Prevent going back to login after authentication
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="auth/login"
          options={{
            headerShown: false,
            // Make login the initial route
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/forgot-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/reset-password"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
      const { TempoDevtools } = require("tempo-devtools");
      TempoDevtools.init();
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SettingsProvider>
        <RootLayoutNav />
      </SettingsProvider>
    </AuthProvider>
  );
}
