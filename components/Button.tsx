import { TouchableOpacity, Text, ViewStyle } from "react-native";
import { useFonts } from "expo-font";
interface CustomButtonProps {
  text: string;
  HandlePress: () => void;
  HandleOnLongPress: () => void; // Function to handle button press
  containerStyles: string;
  size?: string;
  style: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  HandlePress,
  HandleOnLongPress,
  containerStyles,
  size,
  style,
}) => {
  const [loaded] = useFonts({
    Monserrat: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={HandlePress}
      onLongPress={HandleOnLongPress}
      className={`bg-yellow-600 rounded-xl min-h-[45px] flex flex-row justify-center items-center ${containerStyles}`}
      style={style}
    >
      <Text
        className={`text-primary ${size}}`}
        style={{ fontFamily: "Monserrat" }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
