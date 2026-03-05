import React from "react";
import { View, Text, Image } from "react-native";

export const Logo = () => {
  return (
    <View className="items-center pb-2">
      <Text className="text-slate-200 font-bold text-xl">Captain Chef</Text>
      <Image
        source={require("../assets/images/CaptainChefPNG.png")}
        style={{ width: 140, height: 140 }}
      />
    </View>
  );
};
export default Logo;
