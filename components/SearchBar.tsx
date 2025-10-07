import { TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
interface SearchBarProps {
  onChangeText?: (text: string) => void;
  value?: string;
}
const SearchBar = ({ onChangeText, value }: SearchBarProps) => {
  return (
    <View className="flex-row items-center w-36 px-4 py-1 rounded-2xl bg-slate-950  border border-[#2a2a2a]">
      <FontAwesome5 name="search" size={18} color="#9ca3af" />
      <TextInput
        className="flex-1 ml-3 text-base text-white placeholder:text-gray-400"
        placeholder="Filter..."
        placeholderTextColor="#9ca3af"
        clearButtonMode="always"
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBar;
