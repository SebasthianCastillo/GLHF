import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, Dimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
import CustomField from "@/components/Field";
import CustomButton from "@/components/Button";
import { useState } from "react";
import axios from "axios";

const AddCategory = () => {
  const [name, setName] = useState("");
  const router = useRouter();

  const HandleRegister = () => {
    const categoriesData = {
      Name: name,
    };

    axios
      .post("http://192.168.194.133:5000/addCategory", categoriesData)
      .then((response) => {
        Alert.alert("Categoría Agregada 💾");
        setName("");
        // router.push("/");
      })
      .catch((error) => {
        console.log(categoriesData);
        Alert.alert("Error");
        console.log("Error adding category", error);
        router.push("/");
      });
  };

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
            value={name}
            onChangeText={(text: any) => setName(text)}
            otherStyles="mt-10"
            placeholder="Nombre Categoría"
          />
          <View className="p-20">
            <CustomButton
              containerStyles="w-full"
              text="Agregar"
              HandlePress={HandleRegister}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCategory;
