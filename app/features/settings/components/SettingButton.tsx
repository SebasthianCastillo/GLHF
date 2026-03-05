import React from "react";
import { View, Pressable } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const SettingButton = () => {
  return (
    <View>
      <Pressable
        onPress={() => router.push("/SettingScreen")}
        className="p-2"
      >
        <Ionicons name="settings-outline" size={24} color="#A3A3A3" />
      </Pressable>
    </View>
  );
};
export default SettingButton;
