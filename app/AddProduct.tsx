import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, Dimensions, Alert } from "react-native";
import CustomField from "@/components/Field";
import CustomButton from "@/components/Button";
import { useState } from "react";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const AddProduct = () => {
  const [ProductName, setProductName] = useState("");
  const [date, setDate] = useState("");
  const { CategoryKey } = useLocalSearchParams();

  const [CategoryID, setCategoryID] = useState("");

  const HandleRegister = () => {
    const ProductData = {
      Name: ProductName,
      CategoryID: CategoryKey,
    };
    axios
      .post("http://192.168.1.120:5000/addProduct", ProductData)
      .then((response) => {
        Alert.alert("Producto Agregado 💾");
        setProductName("");
        setCategoryID("");
        // router.push("/");
      })
      .catch((error) => {
        console.log(ProductData);
        Alert.alert("Error");
        console.log(error);
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
            title="Nombre Producto"
            value={ProductName}
            onChangeText={(ProductName: any) => setProductName(ProductName)}
            otherStyles="mt-10"
            placeholder="Nombre Producto"
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

export default AddProduct;
