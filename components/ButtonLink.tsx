import { FontAwesome6 } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";

interface ButtonLinkProps {
  onPress?: () => void;
  logotype: string;
  backgroundColor: string;
}

export default function ButtonLink({
  logotype,
  backgroundColor,
  onPress,
}: ButtonLinkProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="p-6 justify-center items-center"
      onPress={onPress}
    >
      <View
        className={`w-14 h-14 rounded-full ${backgroundColor} shadow-xl justify-center items-center`}
      >
        <FontAwesome6 name={logotype} size={32} color="white" />
      </View>
    </TouchableOpacity>
  );
}
