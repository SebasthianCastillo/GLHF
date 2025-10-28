import { View, Text, Switch, TextInput } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RouterBackArrow from "@/components/RouterBackArrow";
import { Pressable } from "react-native";
import { ScrollView } from "react-native";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import Constants from "expo-constants";
const NotificationSettingScreen = () => {
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const [enabled, setEnabled] = useState(true);
  const [intervalDays, setIntervalDays] = useState("7");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const user = useUserStore((state) => state.user);

  interface NotificationSettings {
    intervalDays: number;
    lowStockThreshold: number;
  }

  const notificationSettings: NotificationSettings = {
    intervalDays: Number(intervalDays),
    lowStockThreshold: Number(lowStockThreshold),
  };

  const configNotificationList = [
    {
      id: "intervalDays",
      label: "Remind Every (Days)",
      type: "number",
      value: notificationSettings.intervalDays,
    },
    {
      id: "lowStockThreshold",
      label: "Low Stock Threshold",
      type: "number",
      value: notificationSettings.lowStockThreshold,
    },
  ];

  const updateNotificationSetting = async (
    updates: Partial<NotificationSettings>
  ) => {
    try {
      await axios.post(`${API_URL}/updateReminderSettings`, {
        user: user?.email,
        ...updates,
      });
    } catch (err) {
      console.error(Error, err);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      {/* Header */}
      <View className="px-5 py-4 border-b border-neutral-800 bg-neutral-900 flex-row">
        <RouterBackArrow />
        <Text className="text-2xl font-semibold text-white"></Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {configNotificationList.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            <View className="px-5 py-5 bg-neutral-800/40 flex-row">
              <Text className="text-sm font-medium text-gray-400 uppercase tracking-wide ">
                {section.label}
              </Text>
              <View className="flex-1 items-end">
                {section.type === "toggle" ? (
                  <Switch
                    value={enabled}
                    onValueChange={(value) =>
                      updateNotificationSetting({ [section.id]: value })
                    }
                  />
                ) : (
                  <View className="">
                    <TextInput
                      value={section.value.toString()}
                      onChangeText={(value) =>
                        updateNotificationSetting({ [section.id]: value })
                      }
                      className="text-white text-lg text-center"
                      keyboardType="numeric"
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettingScreen;
