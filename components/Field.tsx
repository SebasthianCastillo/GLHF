import { View, Text, TextInput } from "react-native";
interface FieldProps {
  title?: string;
  value: any;
  placeholder: string;
  onChangeText?: (text: string) => void;
  otherStyles: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  editable?: boolean;
}

const CustomField: React.FC<FieldProps> = ({
  title,
  value,
  placeholder,
  onChangeText,
  otherStyles,
  keyboardType,
  editable,
}) => {
  return (
    <View className={`${otherStyles}`}>
      <View className="w-full bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary items-center justify-center ">
        <TextInput
          className="flex-1 px-4 text-white font-psemibold text-base justify-center items-center text-center"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={editable}
        />
      </View>
    </View>
  );
};

export default CustomField;
