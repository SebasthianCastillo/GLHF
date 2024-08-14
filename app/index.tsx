import { View, ScrollView, TouchableOpacity } from "react-native";
import CustomButton from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { router, Redirect } from "expo-router";
import axios from "axios";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const categories = () => {
    const [categories, setcategories] = useState([]);
    //   const [input, setInput] = useState("");
    //   const router = useRouter();
    useEffect(() => {
      const fetchcategoriesData = async () => {
        try {
          const response = await axios.get("http://localhost:5000/categories");
          setcategories(response.data);
        } catch (error) {
          console.log("error fetching categories data", error);
        }
      };
      fetchcategoriesData();
    }, []);
  };
  console.log(categories);
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center h-full px-5">
          {/* {categories.map((name, index) => (
              <CustomButton
                containerStyles="w-full"
                text={name}
                HandlePress={() => "Proteina"}
              />
            ))} */}

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
