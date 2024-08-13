import { View, ScrollView, TouchableOpacity } from "react-native";
import CustomButton from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { router, Redirect } from "expo-router";
import axios from "axios";

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchcategoriesData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/categories");
        setCategories(response.data);
      } catch (error) {
        console.log("error al traer las categorias", error);
      }
    };
    fetchcategoriesData();
  }, []);
  console.log(categories);
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
