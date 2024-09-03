import { View, ScrollView, TouchableOpacity } from "react-native";
import CustomButton from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { router } from "expo-router";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function HomeScreen() {
  const [categories, setcategories] = useState([]);
  //   const [input, setInput] = useState("");
  //   const router = useRouter();

  // Carga lista entre navegaciones automaticamente
  useFocusEffect(
    useCallback(() => {
      const categories = async () => {
        try {
          const response = await axios.get(
            "http://192.168.194.133:5000/categories"
          );
          setcategories(response.data);
        } catch (error) {
          console.log("error fetching categories data", error);
        }
      };
      categories();
    }, [])
  );
  const navigateToProductosFromCategory = (category: object) => {
    router.push({
      pathname: "/Products",
      params: { category: JSON.stringify(category) },
    });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center h-full px-5">
          {categories.map((category: any) => (
            <CustomButton
              containerStyles="w-full m-2"
              text={category.Name}
              HandlePress={() => navigateToProductosFromCategory(category)}
            />
          ))}

          <TouchableOpacity
            activeOpacity={0.7}
            className="p-10"
            onPress={() => router.push("/AddCategory")}
          >
            <View className="w-16 h-16 bg-yellow-500 rounded-full shadow-lg justify-center items-center">
              <FontAwesome6 name="add" size={40} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
