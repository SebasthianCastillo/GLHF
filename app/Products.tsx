import React, { useState, useCallback, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import CustomField from "@/components/Field";
import { router } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";

const Products = () => {
  const { category } = useLocalSearchParams();
  const categoryObject = Array.isArray(category)
    ? JSON.parse(category[0])
    : JSON.parse(category || "{}");
  const [products, setProducts] = useState([]);
  const [CantidadProducto, setCantidadProducto] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState("P");
  const [quantityProduct, setQuantityProduct] = useState("");
  const [showInputCustomCant, setShowInputCustomCant] = useState(false);
  const [showInputCant, setShowInputCant] = useState(true);
  const [showInputAdd, setShowInputAdd] = useState(true);
  const [showInputMinus, setShowInputMinus] = useState(true);
  const [isOnAdd, setShowInputisOnAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const [formatValue, setFormatValue] = useState("P");
  const [items, setItems] = useState([
    { label: "P", value: "P" },
    { label: "KG", value: "KG" },
    { label: "GR", value: "GR" },
  ]);

  let CategoryName = categoryObject.Name;

  useFocusEffect(
    useCallback(() => {
      const productsFunction = async () => {
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
      productsFunction();
    }, [])
  );
  const productsFunction = async () => {
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
  // funcion Sumar

  const handlePressAdd = (
    idProducto: any,
    fromWhatQuantityCallfunction: string
  ) => {
    const quantityProduct =
      fromWhatQuantityCallfunction === "single" ? 1 : CantidadProducto;
    const operation = "add";
    const addProductDetail = {
      quantity: quantityProduct,
      date: new Date(),
      format: formatValue,
      operation: operation,
    };

    axios
      .post("http://192.168.1.120:5000/addProductDetail", addProductDetail)
      .then((response) => {
        // router.push("/");
        console.log(response);
        quantityUpdateProduct(idProducto, quantityProduct, operation);
      })
      .catch((error) => {
        console.log(addProductDetail);

        console.log(error);
      });
  };
  // Funcion Resta
  const handlePressMinus = (
    idProducto: any,
    fromWhatQuantityCallfunction: string
  ) => {
    const quantityProduct =
      fromWhatQuantityCallfunction === "single" ? 1 : CantidadProducto;
    const operation = "minus";
    const addProductDetail = {
      quantity: quantityProduct,
      date: new Date(),
      format: formatValue,
      operation: operation,
    };

    axios
      .post("http://192.168.1.120:5000/addProductDetail", addProductDetail)
      .then((response) => {
        // router.push("/");
        console.log(response);
        quantityUpdateProduct(idProducto, quantityProduct, operation);
      })
      .catch((error) => {
        console.log(addProductDetail);

        console.log(error);
      });
  };
  //Funcion para actualizar cantidad de producto
  const quantityUpdateProduct = (
    idProducto: any,
    quantityProduct: number,
    operation: string
  ) => {
    const UpdateQuantityData = {
      _id: idProducto,
      quantity: quantityProduct,
      operation: operation,
    };

    axios
      .patch(
        "http://192.168.1.120:5000/quantityUpdateProduct",
        UpdateQuantityData
      )
      .then((response) => {
        productsFunction();
        console.log(UpdateQuantityData);
      })
      .catch((error) => {
        console.log(UpdateQuantityData);
        console.log(error);
      });
  };

  const handleLongPressMinus = () => {
    setShowInputCant(false);
    setShowInputCustomCant(true);
    setShowInputAdd(false);
    setShowInputMinus(false);
  };

  const handleLongPressAdd = () => {
    setShowInputCant(false);
    setShowInputCustomCant(true);
    setShowInputAdd(false);
    setShowInputMinus(false);
    setShowInputisOnAdd(true);
  };

  const handlePressOutside = (event: any) => {
    // Verifica si el toque está fuera del área del dropdown
    setShowInputCant(true);
    setShowInputAdd(true);
    setShowInputMinus(true);
    setShowInputCustomCant(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="p-3 bg-slate-950">
            {products.map((item: any) => (
              <View className="flex-row justify-between items-center ">
                <Text className="text-base text-white font-bold">
                  {item.Name}
                </Text>

                <View style={styles.container}>
                  <DropDownPicker
                    open={open}
                    value={formatValue}
                    items={items}
                    setOpen={setOpen}
                    setValue={setFormatValue}
                    setItems={setItems}
                    containerStyle={styles.dropdownContainer}
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropDownContainerStyle={styles.dropdownList}
                    labelStyle={styles.dropdownLabel}
                    arrowIconStyle={styles.arrowIcon}
                    listItemContainerStyle={styles.listItemContainer}
                    tickIconStyle={styles.tickIcon}
                    listItemLabelStyle={styles.listItemLabel}
                  />
                </View>

                {/* Minus button */}
                {showInputMinus && (
                  <Pressable
                    onPress={() => handlePressMinus(item._id, "single")}
                    onLongPress={handleLongPressMinus}
                  >
                    <View className="p-1 rounded-md shadow-sm">
                      <FontAwesome6 name="minus" size={22} color="white" />
                    </View>
                  </Pressable>
                )}
                {showInputCustomCant && (
                  <View className="p-1 rounded-lg shadow-md space-y-2">
                    <CustomField
                      value={CantidadProducto}
                      onChangeText={(CantidadProducto: any) =>
                        setCantidadProducto(CantidadProducto)
                      }
                      placeholder="Cantidad"
                      keyboardType="numeric"
                      otherStyles=""
                    ></CustomField>

                    <View style={styles.buttonContainer}>
                      <Button
                        color="#F59E0B"
                        title={`${isOnAdd ? "Agregar" : "Restar"}`}
                        onPress={() => handlePressAdd(item._id, "multiple")}
                      />
                    </View>
                  </View>
                )}

                {/* Custom Field */}
                {showInputCant && (
                  <View>
                    <CustomField
                      value={item.quantity}
                      editable={false}
                      placeholder={`${item.quantity}`}
                      keyboardType="numeric"
                      otherStyles=""
                    ></CustomField>
                  </View>
                )}

                {/* Add button */}
                {showInputAdd && (
                  <Pressable
                    onPress={() => handlePressAdd(item._id, "single")}
                    onLongPress={handleLongPressAdd}
                  >
                    <View className="p-1 rounded-md shadow-sm">
                      <FontAwesome6 name="add" size={22} color="white" />
                    </View>
                  </Pressable>
                )}
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
              params: {
                CategoryKey: categoryObject._id,
                CategoryName: CategoryName,
              },
            })
          }
        >
          <View className="w-16 h-16 bg-green-500 rounded-full shadow-lg items-center justify-center">
            <FontAwesome6 name="add" size={40} color="white" />
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 54, // Width of the square
    height: 54, // Height of the square
  },
  dropdownContainer: {
    width: "100%",
    height: "90%",
    borderColor: "transparent", // No border color
    borderWidth: 0, // No border width
    borderRadius: 4,
    backgroundColor: "transparent", // Transparent background
  },
  dropdown: {
    backgroundColor: "transparent", // Transparent background
    borderColor: "white", // No border color
    borderWidth: 1, // No border width
    borderRadius: 4,
  },
  dropdownText: {
    color: "white", // White text
  },
  dropdownList: {
    backgroundColor: "transparent", // Transparent background
    borderColor: "white", // No border color
    borderWidth: 1, // No border width
    borderRadius: 4,
  },
  dropdownLabel: {
    color: "white", // White text for labels
  },
  arrowIcon: {
    width: 0, // Hide the arrow
    height: 0, // Hide the arrow
  },
  listItemContainer: {
    flexDirection: "row", // Make items horizontal
  },
  tickIcon: {
    width: 0, // Hide the tick icon
    height: 0, // Hide the tick icon
  },
  listItemLabel: {
    color: "white", // White text for list items
  },
  buttonContainer: {
    width: "auto", // Ancho del contenedor del botón
    borderRadius: 20, // Bordes redondeados del contenedor
    overflow: "hidden",
  },
});
export default Products;
