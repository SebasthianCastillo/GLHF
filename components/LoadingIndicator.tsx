import { View, ActivityIndicator } from "react-native";

const LoadingIndicator = () => {
  return (
    <View className="justify-center items-center">
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

export default LoadingIndicator;
