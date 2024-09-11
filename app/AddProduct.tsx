import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, Dimensions, Alert, Text } from "react-native";
import CustomField from "@/components/Field";
import CustomButton from "@/components/Button";
import { useState } from "react";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const AddProduct = () => {
  const [ProductName, setProductName] = useState("");
  const [quantityProduct, setquantityProduct] = useState(0);
  const { CategoryKey } = useLocalSearchParams();
  const { CategoryName } = useLocalSearchParams();
  const [CategoryID, setCategoryID] = useState("");

  const HandleRegister = () => {
    const ProductData = {
      Name: ProductName,
      quantity: quantityProduct,
      CategoryID: CategoryKey,
    };
    axios
      .post("http://192.168.194.133:5000/addProduct", ProductData)
      .then((response) => {
        Alert.alert("Producto Agregado 💾");
        setProductName("");
        setCategoryID("");
        // router.push("/");
      })
      .catch((error) => {
        console.log(ProductData);
        Alert.alert("Error");
        console.log("Error adding product", error);
      });
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="justify-center items-center">
        <Text className="text-slate-50">{`Categoría: ${CategoryName}`}</Text>
      </View>
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
