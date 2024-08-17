import React, { useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import CustomField from "@/components/Field";
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
            "http://192.168.1.120:5000/productsByIDCategory",
            {
              params: { CategoryKey: categoryObject._id },
            }
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
      <ScrollView>
        <View className="p-2 bg-slate-950">
          {products.map((item: any) => (
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-white font-bold">
                {item.Name}
              </Text>

              <View className="border border-yellow-300 rounded-md w-14 h-8">
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(itemValue) => setSelectedValue(itemValue)}
                  className=""
                >
                  <Picker.Item label="Porción" value="P" />
                  <Picker.Item label="KG" value="KG" />
                  <Picker.Item label="GR" value="GR" />
                </Picker>
              </View>

              <Pressable>
                <View className="p-1 rounded-md shadow-sm">
                  <FontAwesome6 name="minus" size={22} color="white" />
                </View>
              </Pressable>

              {/* Custom Field */}

              {/* <CustomField
                title={item.name}
                value={CantidadProducto}
                onChangeText={(CantidadProducto: any) =>
                  setCantidadProducto(CantidadProducto)
                }
                placeholder="Cant"
                keyboardType="numeric"
                otherStyles="mb-5"
              /> */}
              <CustomField
                value={CantidadProducto}
                onChangeText={(CantidadProducto: any) =>
                  setCantidadProducto(CantidadProducto)
                }
                placeholder="Cant"
                keyboardType="numeric"
                otherStyles="mb-5"
              ></CustomField>

              {/* Increase Button */}
              <Pressable>
                <View className="p-1 rounded-md shadow-sm">
                  <FontAwesome6 name="add" size={22} color="white" />
                </View>
              </Pressable>

              {/* Historial Button */}
              <Pressable>
                <View className="p-1 rounded-md shadow-sm">
                  <FontAwesome5 name="history" size={24} color="white" />
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.7}
        className="p-10 items-center"
        onPress={() =>
          router.push({
            pathname: "/AddProduct",
            params: { CategoryKey: categoryObject._id },
          })
        }
      >
        <View className="w-16 h-16 bg-green-500 rounded-full shadow-lg items-center justify-center">
          <FontAwesome6 name="add" size={40} color="white" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Products;
