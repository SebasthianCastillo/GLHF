import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import CustomField from "@/components/Field";
import CustomButton from "@/components/Button";
import { useState, useEffect } from "react";
import axios from "axios";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState("");
  const router = useRouter();
  useEffect(() => {
    const fetchcategoriesData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/categories");
        setCategories(response.data);
      } catch (error) {
        console.log("error fetching employee data", error);
      }
    };
    fetchcategoriesData();
  }, []);
  console.log(categories);
  const [Form, setForm] = useState({
    name: "",
  });
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <CustomField
            title="Categoría"
            value={Form.name}
            handleChangeText={(e: any) => setForm({ ...Form, name: e })}
            otherStyles="mt-10"
            placeholder="Nombre Categoría"
          />
          <View className="p-20">
            <CustomButton
              containerStyles="w-full"
              text="Agregar"
              HandlePress={() => "Proteina"}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCategory;
