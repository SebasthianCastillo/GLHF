import { TouchableOpacity, Text, ViewStyle, View } from "react-native";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
interface CustomButtonProps {
  text: string;
  HandlePress?: () => void;
  HandleOnLongPress?: () => void; // Function to handle button press
  containerStyles: string;
  size?: string;
  style?: ViewStyle;
  showIcon?: boolean;
  containerStylesText?: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  HandlePress,
  HandleOnLongPress,
  containerStyles,
  size,
  style,
  showIcon = false,
  containerStylesText,
}) => {
  const [loaded] = useFonts({
    Rubik: require("../assets/fonts/Rubik-VariableFont_wght.ttf"),
  });
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={HandlePress}
      onLongPress={HandleOnLongPress}
      className={`bg-yellow-600 rounded-xl min-h-[45px] flex flex-row items-center ${containerStyles}`}
      style={style}
    >
      <View className={`flex-1 flex-row items-center justify-between`}>
        <View
          className={`flex-1 flex-row items-center justify-between ${containerStylesText}`}
        >
          <Text
            className={`text-primary ${size}`}
            style={{
              fontFamily: "Rubik",
              textAlign: "center",
              flex: 1,
            }}
          >
            {text}
          </Text>
        </View>
        {showIcon && (
          <View className="pr-2">
            <Ionicons name="color-palette-outline" size={28} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
