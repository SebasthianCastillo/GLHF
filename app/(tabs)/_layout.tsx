import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View, Platform } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#9BA1A6",
        headerShown: false,
        tabBarStyle: {
          position: "relative",
          backgroundColor: "rgba(21, 23, 24, 0.85)",
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 25 : 8,
          paddingTop: 8,
        },
        tabBarBackground: () => <View className="flex-1 bg-neutral-900/85" />,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
              {focused && (
                <View className="absolute -bottom-2 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ExpenseList"
        options={{
          title: "Gastos",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              <TabBarIcon
                name={focused ? "wallet" : "wallet-outline"}
                color={color}
              />
              {focused && (
                <View className="absolute -bottom-2 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
