import { useState, useEffect } from "react";
import { View, Text, Switch, Pressable, ScrollView } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { useUserStore } from "@/store/useUserStore";
import RouterBackArrow from "@/components/RouterBackArrow";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { sections } from "./features/settings/config/settingsConfig";
import { updateUserSettings } from "./features/settings/api/settings";

const SettingsScreen = () => {
  const user = useUserStore((state) => state.user);
  const [enabled, setEnabled] = useState(
    user?.settings.reminderSettings.enabled,
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      {/* Header */}
      <View className="px-5 py-4 border-b border-neutral-800 bg-neutral-900 flex-row items-center">
        <RouterBackArrow />
        <Text className="text-2xl font-semibold text-white ml-3">Settings</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            {/* Section Title */}
            <View className="px-5 py-3 bg-neutral-800/40">
              <Text className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                {section.title}
              </Text>
            </View>

            {/* Section Items */}
            {section.items.map((item) => (
              <View className="bg-neutral-800/40 p-6 flex-row justify-between items-center">
                {item.type === "toggleMainScreen" ? (
                  <View className="flex-row items-center " key={item.id}>
                    <Text className="text-white text-base">{item.label}</Text>
                    <View className="flex-1 items-end">
                      <Switch
                        value={enabled}
                        onValueChange={(value) => {
                          // updateNotificationSetting({ [section.id]: value })
                          // console.log(user?.email!)
                          setEnabled(value);
                          updateUserSettings("reminderSettings", user?.email!, {
                            [item.id]: value,
                          });
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Pressable
                      key={item.id}
                      className="w-full flex-row justify-between items-center py-4 pr-2"
                      onPress={() => {
                        if (item.type === "navigation") {
                          router.push(`../Settings/${item.id}`);
                        }
                      }}
                    >
                      <Text className="text-white text-base">{item.label}</Text>
                      <FontAwesome6
                        name="chevron-right"
                        size={18}
                        color="white"
                      />
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default SettingsScreen;
