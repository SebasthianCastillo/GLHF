import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();
export default function RootLayout() {
  const [loaded] = useFonts({
    Rubik: require("../assets/fonts/Rubik-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="AddCategory" options={{ headerShown: false }} />
        <Stack.Screen name="Products" options={{ headerShown: false }} />
        <Stack.Screen name="AddProduct" options={{ headerShown: false }} />
        <Stack.Screen name="SettingScreen" options={{ headerShown: false }} />
        <Stack.Screen
          name="NotificationSettingScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ProductDetail" options={{ headerShown: false }} />
        <Stack.Screen
          name="ProductStockValues"
          options={{ headerShown: false }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
