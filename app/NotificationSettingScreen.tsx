import { View, Text, Switch, TextInput } from "react-native";
import { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RouterBackArrow from "@/components/RouterBackArrow";
import { ScrollView } from "react-native";
import { useUserStore } from "@/store/useUserStore";
import { updateUserSettings } from "@/app/features/settings/api/settings";

const NotificationSettingScreen = () => {
  const user = useUserStore((state) => state.user);
  const updateUserSettingsContext = useUserStore(
    (state) => state.updateUserSettingsContext,
  );
  const [intervalDays, setIntervalDays] = useState(
    user?.settings.reminderSettings.intervalDays.toString(),
  );

  const [lowStockThreshold, setLowStockThreshold] = useState(
    user?.settings.reminderSettings.lowStockThreshold.toString(),
  );

  interface NotificationSettings {
    intervalDays: number;
    lowStockThreshold: number;
  }

  interface SettingConfig {
    id: string;
    label: string;
    type: "navigation" | "toggle" | "info" | "input";
    value?: any;
    description?: string;
    badge?: string;
  }

  const notificationSettings: NotificationSettings = {
    intervalDays: Number(intervalDays),
    lowStockThreshold: Number(lowStockThreshold),
  };

  const configNotificationList: SettingConfig[] = [
    {
      id: "intervalDays",
      label: "Remind Every (Days)",
      type: "input",
      value: notificationSettings.intervalDays,
    },
    {
      id: "lowStockThreshold",
      label: "Low Stock Threshold",
      type: "input",
      value: notificationSettings.lowStockThreshold,
    },
  ];

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
        {configNotificationList.map((section) => (
          <View key={section.id}>
            <View className="px-5 py-5 bg-neutral-800/40 flex-row">
              <Text className="text-sm font-medium text-gray-400 uppercase tracking-wide ">
                {section.label}
              </Text>
              <View className="flex-1 items-end">
                {section.type === "toggle" ? (
                  <Switch
                  // value={enabled}
                  // onValueChange={(value) => {
                  //   updateUserSettings("updateUserSettings", user?.email!, {
                  //     [section.id]: value,
                  //   });
                  // }}
                  />
                ) : (
                  <View className="">
                    <TextInput
                      value={
                        section.id === "intervalDays"
                          ? intervalDays === "0"
                            ? ""
                            : intervalDays
                          : lowStockThreshold === "0"
                            ? ""
                            : lowStockThreshold
                      }
                      onChangeText={(value) => {
                        {
                          if (section.id === "intervalDays") {
                            setIntervalDays(value);
                          } else if (section.id === "lowStockThreshold") {
                            setLowStockThreshold(value);
                          }
                        }
                        updateUserSettingsContext({
                          [section.id]: value,
                        });

                        updateUserSettings("reminderSettings", user?.email!, {
                          [section.id]: value,
                        });
                      }}
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
