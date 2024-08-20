import { View, Text, FlatList } from "react-native";
import React, { useState, useCallback, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
interface ProductDetail {
  _id: string;
  quantity: number;
  date: Date;
  format: string;
  operation: string;
  ProductID: string;
}
const ProductDetail = () => {
  const { product } = useLocalSearchParams();
  const [productDetail, setProductsDetail] = useState([]);
  const productObject = Array.isArray(product)
    ? JSON.parse(product[0])
    : JSON.parse(product || "{}");

  useFocusEffect(
    useCallback(() => {
      const productDetailFunction = async () => {
        try {
          const response = await axios.get(
            "http://192.168.1.120:5000/productDetailByIDProduct",
            {
              params: { ProductKey: productObject._id },
            }
          );
          setProductsDetail(response.data.json());
        } catch (error) {
          console.log("error fetching products data", error);
        }
      };
      productDetailFunction();
    }, [])
  );

  const renderItem = ({ item }: { item: ProductDetail }) => (
    <View className="p-4 mb-4 bg-gray-800 rounded-lg shadow-md">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-white">Quantity</Text>
        <Text className="text-lg font-medium text-gray-300">
          {item.quantity}
        </Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-white">Date</Text>
        <Text className="text-lg font-medium text-gray-300">
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
  return (
    <SafeAreaView>
      <FlatList
        data={productDetail}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()} // Asegúrate de que `item.id` sea único
      />
    </SafeAreaView>
  );
};

export default ProductDetail;
