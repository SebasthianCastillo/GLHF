import React, { useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DataTable } from "react-native-paper";

const Products = () => {
  const [ProductName, setProductName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [format, setFormat] = useState("");
  const [weight, setWeight] = useState("");
  const [CategoryID, setCategoryID] = useState("");

  const HandleRegister = () => {
    const ProductData = {
      Name: ProductName,
      date: date,
      type: type,
      format: format,
      weight: weight,
      CategoryID: CategoryID,
    };
    axios
      .post("http://192.168.1.120:5000/addProduct", ProductData)
      .then((response) => {
        Alert.alert("Producto Agregado 💾");
        setProductName("");
        setDate("");
        setType("");
        setFormat("");
        setWeight("");
        setCategoryID("");
        // router.push("/");
      })
      .catch((error) => {
        console.log(ProductData);
        Alert.alert("Error");
        console.log(error);
      });
  };
  const { name } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const products = async () => {
        try {
          const response = await axios.get(
            "http://192.168.1.120:5000/products"
          );
          setProducts(response.data);
        } catch (error) {
          console.log("error fetching products data", error);
        }
      };
      products();
    }, [])
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center h-full px-5">
          {products.map((item: any) => (
            <View
              style={{
                marginTop: 15,
                margin: 5,
                padding: 5,
                backgroundColor: "#A1FFCE",
                borderRadius: 5,
              }}
            >
              <DataTable>
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
              </DataTable>
            </View>
          ))}
          <TouchableOpacity
            activeOpacity={0.7}
            className="p-10"
            onPress={HandleRegister}
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
