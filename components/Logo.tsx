import React from "react";
import { View, Text, Image } from "react-native";

export const Logo = () => {
  return (
    <View className="items-center pb-1">
      <Text className="text-slate-300 font-bold text-2xl">Captain Chef</Text>
      <Image
        source={require("../assets/images/CaptainChefPNG.png")} // Logo
        style={{ width: 180, height: 180 }}
      />
    </View>
  );
};
export default Logo;
