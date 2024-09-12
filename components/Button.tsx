import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

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
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={HandlePress}
      onLongPress={HandleOnLongPress}
      className={`bg-yellow-600 rounded-xl min-h-[45px] flex flex-row justify-center items-center ${containerStyles}`}
      style={style}
    >
      <Text className={`text-primary ${size}}`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
