import { Pressable, View, ScrollView } from "react-native";
import CustomButton from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <CustomButton
          containerStyles="w-full mt-7"
          text="Proteina"
          onPress={() => "Proteina"}
        />
        <CustomButton
          containerStyles="w-full mt-7"
          text="Verdura"
          onPress={() => "Verdura"}
        />
        <CustomButton
          containerStyles="w-full mt-7"
          text="Abarrotes"
          onPress={() => "Abarrotes"}
        />
        <Pressable>
          <View>
            <FontAwesome6 name="add" size={40} color="white" />
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
