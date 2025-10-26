import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { useUserStore } from "@/store/useUserStore";
import RouterBackArrow from "@/components/RouterBackArrow";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function SettingsScreen() {
  const user = useUserStore((state) => state.user);

  const [enabled, setEnabled] = useState(true);
  const [intervalDays, setIntervalDays] = useState("7");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  interface SettingItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    type: "navigation" | "toggle" | "info";
    value?: boolean;
    description?: string;
    badge?: string;
  }

  interface SettingSection {
    title: string;
    items: SettingItem[];
  }
  const sections: SettingSection[] = [
    {
      title: "Notifications",
      items: [
        {
          id: "reminderSetting",
          label: "Reminder Setting",
          icon: <FontAwesome6 name="bell" size={24} color="white" />,
          type: "navigation",
          description: "Manage your account settings",
        },
      ],
    },
  ];

  //   useEffect(() => {
  //     // Load user's current settings (if available)
  //     if (user?.reminderSettings) {
  //       setEnabled(user.reminderSettings.enabled);
  //       setIntervalDays(String(user.reminderSettings.intervalDays));
  //       setLowStockThreshold(String(user.reminderSettings.lowStockThreshold));
  //     }
  //   }, [user]);

  const saveSettings = async () => {
    try {
      await axios.post(`${API_URL}/updateReminderSettings`, {
        user: user?.email,
        enabled,
        intervalDays: Number(intervalDays),
        lowStockThreshold: Number(lowStockThreshold),
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not save settings");
    }
  };

  return (
    // <View className="flex-1 bg-primary items-center justify-center px-6">
    //   <RouterBackArrow />
    //   <Text className="text-white text-2xl font-bold mb-6">
    //     Reminder Settings
    //   </Text>

    //   <View className="w-full bg-slate-800 rounded-2xl p-5 mb-4">
    //     <View className="flex-row justify-between items-center mb-4">
    //       <Text className="text-white text-lg">Enable Reminders</Text>
    //       <Switch value={enabled} onValueChange={setEnabled} />
    //     </View>

    //     <Text className="text-white mb-1">Reminder Interval (days)</Text>
    //     <TextInput
    //       className="bg-white rounded-xl p-3 mb-4"
    //       keyboardType="numeric"
    //       value={intervalDays}
    //       onChangeText={setIntervalDays}
    //     />

    //     <Text className="text-white mb-1">Low Stock Threshold</Text>
    //     <TextInput
    //       className="bg-white rounded-xl p-3 mb-4"
    //       keyboardType="numeric"
    //       value={lowStockThreshold}
    //       onChangeText={setLowStockThreshold}
    //     />
    //   </View>
    // </View>
    <SafeAreaView className="flex-1 bg-neutral-900">
      {/* Header */}
      <View className="px-5 py-4 border-b border-neutral-800 bg-neutral-900 flex-row">
        <RouterBackArrow />
        <Text className="text-2xl font-semibold text-white">Settings</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            <View className="px-5 py-3 bg-neutral-800/40">
              <Text className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                {section.title}
              </Text>
            </View>

            <View className="px-4 pt-2">
              {section.items.map((item, itemIndex) => (
                <View
                  key={item.id || itemIndex}
                  className="bg-neutral-800 rounded-2xl p-5 mb-4"
                >
                  <Text className="text-white">{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
