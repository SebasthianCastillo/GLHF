import { View, Text, TextInput } from "react-native";
interface FieldProps {
  title?: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  otherStyles: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

const CustomField: React.FC<FieldProps> = ({
  title,
  value,
  placeholder,
  onChangeText,
  otherStyles,
  keyboardType,
}) => {
  return (
    <View className={`${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary items-center ">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};

export default CustomField;
