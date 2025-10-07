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
    <TouchableOpacity activeOpacity={0.7} className="p-10" onPress={onPress}>
      <View
        className={`w-16 h-16 rounded-full ${backgroundColor} shadow-lg justify-center items-center`}
      >
        <FontAwesome6 name={logotype} size={40} color="white" />
      </View>
    </TouchableOpacity>
  );
}
