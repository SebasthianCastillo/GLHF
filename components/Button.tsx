import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface CustomButtonProps {
  text: string;
  HandlePress: () => void; // Function to handle button press
  containerStyles: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  HandlePress,
  containerStyles,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={HandlePress}
      className={`bg-yellow-600 rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles}`}
    >
      <Text className={`text-primary text-lg`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
