import React from "react";
import { TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";

const RouterBackArrow = () => {
  return (
    <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
      <FontAwesome6 name="arrow-left" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default RouterBackArrow;
