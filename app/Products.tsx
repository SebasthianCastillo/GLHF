import React, { useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DataTable } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import CustomField from "@/components/Field";
import CustomButton from "@/components/Button";
import { router } from "expo-router";

const Products = () => {
  const { category } = useLocalSearchParams();
  const categoryObject = Array.isArray(category)
    ? JSON.parse(category[0])
    : JSON.parse(category || "{}");
  const [products, setProducts] = useState([]);
  const [CantidadProducto, setCantidadProducto] = useState("");
  const [selectedValue, setSelectedValue] = useState("P");
  const [cantidad, setCantidad] = useState("");

  useFocusEffect(
    useCallback(() => {
      const products = async () => {
        try {
          const response = await axios.get(
            "http://192.168.1.120:5000/productsByIDCategory"
          );
          setProducts(response.data);
        } catch (error) {
          console.log("error fetching products data", error);
        }
      };
      products();
    }, [])
  );
  // const handlePressAdd = () => {
  //     const categoriesData = {
  //       Name: name,
  //     };

  //     axios
  //       .post("http://192.168.1.120:5000/addCategory", categoriesData)
  //       .then((response) => {
  //         Alert.alert("Categoría Agregada 💾");
  //         setName("");
  //         // router.push("/");
  //       })
  //       .catch((error) => {
  //         console.log(categoriesData);
  //         Alert.alert("Error");
  //         console.log(error);
  //         router.push("/");
  //       });
  //   };
  // const handlePressDecrease = () => {
  //   const categoriesData = {
  //     Name: name,
  //   };

  //   axios
  //     .post("http://192.168.1.120:5000/addCategory", categoriesData)
  //     .then((response) => {
  //       Alert.alert("Categoría Agregada 💾");
  //       setName("");
  //       // router.push("/");
  //     })
  //     .catch((error) => {
  //       console.log(categoriesData);
  //       Alert.alert("Error");
  //       console.log(error);
  //       router.push("/");
  //     });
  // };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center h-full px-5">
          {products.map((item: any) => (
            <View className=" bg-white-300 rounded-md flex-row">
              <Text className="p-2 text-base text-gray-100 font-pmedium">
                {item.Name}
              </Text>
              {/* Combo Box */}
              <View className="w-10">
                <View className="border border-gray-300 rounded-lg overflow-hidden">
                  <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelectedValue(itemValue)
                    }
                  >
                    <Picker.Item label="P" value="P" />
                    <Picker.Item label="KG" value="KG" />
                    <Picker.Item label="GR" value="GR" />
                  </Picker>
                </View>
              </View>
              {/* Botón con signo mas */}
              <Pressable className="p-10">
                {/* // onPress={handlePressAdd}> */}

                <View className="p-4 bg-white-500 rounded-full shadow-lg">
                  <FontAwesome6 name="minus" size={20} color="white" />
                </View>
              </Pressable>

              <CustomField
                title={item.name}
                value={CantidadProducto}
                onChangeText={(text: any) => setCantidadProducto(text)}
                otherStyles="mt-10"
                placeholder="Nombre Categoría"
                keyboardType="numeric"
              />
              {/* Segundo botón con signo menos */}
              <Pressable className="p-10">
                {/* onPress={handlePressDecrease}> */}

                <View className="p-4 bg-white-500 rounded-full shadow-lg">
                  <FontAwesome6 name="add" size={20} color="white" />
                </View>
              </Pressable>

              {/* Botón Historial */}
              <CustomButton
                containerStyles=""
                text="Historial"
                HandlePress={() => ""}
                // {() => navigateToProductos(item.Name)}
              />

              {/* <DataTable>
                <DataTable.Header>
                  <DataTable.Title>P</DataTable.Title>
                  <DataTable.Title>A</DataTable.Title>
                  <DataTable.Title>HD</DataTable.Title>
                  <DataTable.Title>H</DataTable.Title>
                  <DataTable.Title>NW</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                  <DataTable.Cell>{item?.present}</DataTable.Cell>
                  <DataTable.Cell>{item?.absent}</DataTable.Cell>
                  <DataTable.Cell>{item?.halfday}</DataTable.Cell>
                  <DataTable.Cell>1</DataTable.Cell>
                  <DataTable.Cell>8</DataTable.Cell>
                </DataTable.Row>
              </DataTable> */}
            </View>
          ))}
          <TouchableOpacity
            activeOpacity={0.7}
            className="p-10"
            onPress={() =>
              router.push({
                pathname: "/AddProduct",
                params: { CategoryKey: categoryObject._id },
              })
            }
          >
            <View className="p-4 bg-green-500 rounded-full shadow-lg">
              <FontAwesome6 name="add" size={40} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Products;
