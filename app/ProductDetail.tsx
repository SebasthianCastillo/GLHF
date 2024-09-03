import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { response } from "express";

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
  const [productDetail, setProductsDetail] = useState<ProductDetail[]>([]);
  const [filteredDetails, setFilteredDetails] = useState<ProductDetail[]>([]);
  const [ProductDetailSummaryAdd, setProductDetailSummaryAdd] = useState("");
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  const productObject = Array.isArray(product)
    ? JSON.parse(product[0])
    : JSON.parse(product || "{}");

  useFocusEffect(
    useCallback(() => {
      const productDetailFunction = async () => {
        try {
          const response = await axios.get(
            "http://192.168.194.133:5000/productDetailByIDProduct",
            {
              params: { ProductKey: productObject._id },
            }
          );
          setProductsDetail(response.data);
          filterByMonth(response.data, currentMonth, currentYear); // Filter data initially
        } catch (error) {
          console.log("error fetching products data", error);
        }
      };
      productDetailFunction();
    }, [currentMonth, currentYear])
  );
  useFocusEffect(
    useCallback(() => {
      const productDetailSummaryAdd = async () => {
        try {
          const response = await axios.get(
            "http://192.168.194.133:5000/productDetailSummaryByOperation",
            {
              params: { ProductKey: productObject._id },
            }
          );

          filterByMonth(response.data, currentMonth, currentYear); // Filter data initially

          // Establece el estado con el valor de `totalQuantity`
          setProductDetailSummaryAdd(response.data);
        } catch (error) {
          console.log("error fetching products detail summary data", error);
        }
      };
      productDetailSummaryAdd();
    }, [currentMonth, currentYear])
  );

  const filterByMonth = (
    data: ProductDetail[],
    month: number,
    year: number
  ) => {
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === month && itemDate.getFullYear() === year;
    });
    setFilteredDetails(filtered);
  };

  const handlePrevMonth = () => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(prevMonth);
    setCurrentYear(prevYear);
  };

  const handleNextMonth = () => {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };

  const formatMonthYear = (month: number, year: number) => {
    const months = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];
    return `${months[month]}, ${year.toString().slice(-2)}`;
  };

  const renderItem = ({ item }: { item: ProductDetail }) => (
    <View
      className={`p-1 mb-2 ${
        item.operation === "add" ? "bg-emerald-600" : "bg-red-500"
      } rounded-lg shadow-md`}
    >
      <View className="flex-row h-24">
        {/* Cuadro de Cantidad */}
        <View className="flex-1 items-center justify-center border-r border-gray-300">
          <Text className="text-4xl font-bold text-white">{`${
            item.operation === "add" ? "+" : "-"
          } ${item.quantity}`}</Text>
        </View>

        {/* Cuadro de Formato */}
        <View className="flex-1 items-center justify-center border-r border-gray-300">
          <Text className="text-4xl font-bold text-white">{item.format}</Text>
        </View>

        {/* Cuadro de Fecha */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-bold text-white">
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text className="text-lg font-medium text-white">
            {new Date(item.date).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex-row items-center justify-between px-4 py-3 bg-primary  ">
          <TouchableOpacity onPress={handlePrevMonth} className="px-3 py-1">
            <Text className="text-2xl text-yellow-500">&lt;</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">
            {formatMonthYear(currentMonth, currentYear)}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} className="px-3 py-1">
            <Text className="text-2xl text-yellow-500">&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Header de columnas */}
        <View className="flex-row h-12 bg-primary ">
          <View className="flex-1 items-center justify-center  ">
            <Text className="text-lg font-bold text-white">Cantidad</Text>
          </View>
          <View className="flex-1 items-center justify-center  ">
            <Text className="text-lg font-bold text-white">Formato</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-bold text-white">Fecha</Text>
          </View>
        </View>

        <FlatList
          data={filteredDetails}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()} // Asegúrate de que `item.id` sea único
        />
        <View
          className="p-1 mb-2  bg-emerald-600
      rounded-lg shadow-md"
        >
          <Text className="text-4xl font-bold text-white">
            {ProductDetailSummaryAdd}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
