import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface SearchBarProps {
  onChangeText?: (text: string) => void;
  value?: string;
}
const SearchBar = ({ onChangeText, value }: SearchBarProps) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TextInput
        placeholder="Search"
        clearButtonMode="always"
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
      ></TextInput>
    </SafeAreaView>
  );
};

export default SearchBar;
