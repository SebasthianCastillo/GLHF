import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
interface FieldProps {
  title: string;
  value: string;
  placeholder: string;
  onChangeText: any;
  otherStyles: string;
}

const CustomField: React.FC<FieldProps> = ({
  title,
  value,
  placeholder,
  onChangeText,
  otherStyles,
}) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="p-2 text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default CustomField;
