import { Pressable, View, ScrollView, TouchableOpacity } from "react-native";
import CustomButton from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Redirect } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center h-full px-5">
          <CustomButton
            containerStyles="w-full"
            text="Proteina"
            HandlePress={() => "Proteina"}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            className="p-10"
            onPress={() => router.push("/AddCategory")}
          >
            <View className="p-4 bg-yellow-500 rounded-full shadow-lg">
              <FontAwesome6 name="add" size={40} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
