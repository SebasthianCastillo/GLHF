import { View, ActivityIndicator } from "react-native";

const LoadingIndicator = () => {
  return (
    <View className="p-10 justify-center items-center">
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

export default LoadingIndicator;
