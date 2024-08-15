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
            "http://192.168.1.120:5000/categories"
          );
          setcategories(response.data);
        } catch (error) {
          console.log("error fetching categories data", error);
        }
      };
      categories();
    }, [])
  );
  const navigateToProductos = (productName: any) => {
    router.push({
      pathname: "/Products",
      params: { name: productName },
    });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center h-full px-5">
          {categories.map((item: any) => (
            <CustomButton
              containerStyles="w-full m-2"
              text={item.Name}
              HandlePress={() => navigateToProductos(item.Name)}
            />
          ))}

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
