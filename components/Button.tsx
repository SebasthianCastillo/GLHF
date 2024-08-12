import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface CustomButtonProps {
  text: string;

  onPress: () => void; // Function to handle button press
  containerStyles: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,

  onPress,
  containerStyles,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`bg-secondary-200 rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles}`}
    >
      <Text className={`text-primary font-mono text-lg`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
