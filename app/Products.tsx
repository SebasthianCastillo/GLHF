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
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomField from "@/components/Field";
import ModalProducts from "@/components/OptionModal";
import { router } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";

const Products = () => {
  const { category } = useLocalSearchParams();
  const categoryObject = Array.isArray(category)
    ? JSON.parse(category[0])
    : JSON.parse(category || "{}");
  const [products, setProducts] = useState([]);
  const [CantidadProducto, setCantidadProducto] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [showInputCustomCant, setShowInputCustomCant] = useState(false);
  const [showInputCant, setShowInputCant] = useState(true);
  const [showInputAdd, setShowInputAdd] = useState(true);
  const [showInputMinus, setShowInputMinus] = useState(true);
  const [showInputAdd2, setShowInputAdd2] = useState(false);
  const [showInputMinus2, setShowInputMinus2] = useState(false);
  const [showInputCant2, setShowInputCant2] = useState(false);
  const [formatValues, setFormatValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [isOnAdd, setShowInputisOnAdd] = useState(false);
  const [formatValue, setFormatValue] = useState("P");
  const [items, setItems] = useState([
    { label: "P", value: "P" },
    { label: "KG", value: "KG" },
    { label: "GR", value: "GR" },
  ]);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<SelectedValuesType>({});
  const [showOptionsModal, setShowOptionsModal] = useState(false); // Para mostrar el menú de opciones

  let CategoryName = categoryObject.Name;

  useFocusEffect(
    useCallback(() => {
      const productsFunction = async () => {
        try {
          const response = await axios.get(
            "http://192.168.194.133:5000/productsByIDCategory",
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
        "http://192.168.194.133:5000/productsByIDCategory",
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
    let operation = "add";
    const addProductDetail = {
      quantity: quantityProduct,
      date: new Date(),
      format: formatValue,
      operation: operation,
      ProductID: idProducto,
    };

    axios
      .post("http://192.168.194.133:5000/addProductDetail", addProductDetail)
      .then((response) => {
        console.log(response);
        quantityUpdateProduct(idProducto, quantityProduct, operation);
        productsFunction();
        handlePressOutside();
      })
      .catch((error) => {
        console.log(addProductDetail);
        console.log("Error AddProductDetail", error);
      });
  };

  // Funcion Resta

  const handlePressMinus = (
    idProducto: any,
    fromWhatQuantityCallfunction: string
  ) => {
    const quantityProduct =
      fromWhatQuantityCallfunction === "single" ? 1 : CantidadProducto;
    let operation = "minus";
    const addProductDetail = {
      quantity: quantityProduct,
      date: new Date(),
      format: formatValue,
      operation: operation,
      ProductID: idProducto,
    };

    axios
      .post("http://192.168.194.133:5000/addProductDetail", addProductDetail)
      .then((response) => {
        // router.push("/");
        console.log(response);
        quantityUpdateProduct(idProducto, quantityProduct, operation);
        productsFunction();
        handlePressOutside();
      })
      .catch((error) => {
        console.log(addProductDetail);

        console.log("Error AddProductDetail minus", error);
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
        "http://192.168.194.133:5000/quantityUpdateProduct",
        UpdateQuantityData
      )
      .then((response) => {
        productsFunction();
        console.log(UpdateQuantityData);
      })
      .catch((error) => {
        console.log(UpdateQuantityData);
        console.log("Error quantity update product", error);
      });
  };

  const handleLongPressMinus = (ItemId: any) => {
    setSelectedItemId(ItemId);
    setShowInputAdd(false);
    setShowInputMinus(false);
    setShowInputCant(false);
    setShowInputCustomCant(true);
    setShowInputMinus2(true);
    setShowInputCant2(true);
    setShowInputAdd2(true);
    setShowInputisOnAdd(false);
  };

  const handleLongPressAdd = (ItemId: any) => {
    setSelectedItemId(ItemId);
    setShowInputCant(false);
    setShowInputAdd(false);
    setShowInputMinus(false);
    setShowInputisOnAdd(true);

    setShowInputCustomCant(true);
    setShowInputAdd2(true);
    setShowInputCant2(true);
    setShowInputMinus2(true);
  };

  // Verifica si el toque está fuera del área del dropdown
  const handlePressOutside = () => {
    setShowInputCant(true);
    setShowInputAdd(true);
    setShowInputMinus(true);
    setShowInputCustomCant(false);
    setShowInputMinus2(false);
    setShowInputAdd2(false);
    setShowInputCant2(false);
  };

  const handleDropdownOpen = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  type SelectedValuesType = {
    [key: string]: string; // Las claves son las ids de tipo string, y los valores también son strings
  };

  //maneja el comportamiento de los dropdown para elegir formato P, KG, GR
  const handleDropdownChange = (id: string, newValue: string) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [id]: newValue,
    }));
    setFormatValue(newValue);
  };

  //modal para confirmar eliminacion
  const confirmDelete = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: () => {
            deleteProduct(selectedItemId); // Llamar a la función de eliminación si se confirma
          },
        },
      ]
    );
  };

  // Función para manejar el long press y mostrar las opciones
  const handleLongPressDelete = (idProducto: any) => {
    setSelectedItemId(idProducto); // Guardar el ID del producto seleccionado
    setShowOptionsModal(true); // Mostrar el menú de opciones
  };

  //funcion para eliminar producto
  const deleteProduct = async (idProducto: any) => {
    try {
      await axios.delete(
        `http://192.168.194.133:5000/deleteProduct/${idProducto}`
      );
      // Refrescar la lista de productos después de eliminar
      const response = await axios.get(
        "http://192.168.194.133:5000/productsByIDCategory",
        { params: { CategoryKey: categoryObject._id } }
      );
      setProducts(response.data);
    } catch (error) {
      console.log("Error deleting product", error);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="p-4 space-y-3 bg-slate-950">
            {products.map((item: any) => (
              <View className="flex-row justify-between items-center">
                <View className="w-20">
                  <Pressable
                    key={item._id}
                    onLongPress={() => handleLongPressDelete(item._id)} // handle long press
                  >
                    <Text className="text-base text-white font-bold">
                      {item.Name}
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={[
                    styles.container,
                    { zIndex: openDropdownId === item._id ? 1000 : 1 },
                  ]}
                >
                  <DropDownPicker
                    open={openDropdownId === item._id}
                    value={selectedValues[item._id] || "P"}
                    items={items}
                    setOpen={() => handleDropdownOpen(item._id)}
                    setValue={(callback) => {
                      const selectedValue = callback(formatValues[item._id]);
                      handleDropdownChange(item._id, selectedValue);
                    }}
                    setItems={() => {}}
                    containerStyle={styles.dropdownContainer}
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropDownContainerStyle={[
                      styles.dropdownList,
                      { zIndex: 1001 },
                    ]}
                    labelStyle={styles.dropdownLabel}
                    arrowIconStyle={{ width: 0, height: 0 }}
                    listItemContainerStyle={styles.listItemContainer}
                    tickIconStyle={styles.tickIcon}
                    listItemLabelStyle={styles.listItemLabel}
                  />
                </View>

                {/* Minus button */}
                {showInputMinus && (
                  <Pressable
                    onPress={() => handlePressMinus(item._id, "single")}
                    onLongPress={() => handleLongPressMinus(item._id)}
                  >
                    <View className="p-1 rounded-md shadow-sm">
                      <FontAwesome6 name="minus" size={22} color="white" />
                    </View>
                  </Pressable>
                )}
                {showInputMinus2 && item._id !== selectedItemId && (
                  <Pressable
                    onPress={() => handlePressMinus(item._id, "single")}
                    onLongPress={() => handleLongPressMinus(item._id)}
                  >
                    <View className="p-1 rounded-md shadow-sm">
                      <FontAwesome6 name="minus" size={22} color="white" />
                    </View>
                  </Pressable>
                )}
                {showInputCustomCant && item._id === selectedItemId && (
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
                        onPress={() =>
                          isOnAdd
                            ? handlePressAdd(item._id, "multiple")
                            : handlePressMinus(item._id, "multiple")
                        }
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
                {showInputCant2 && item._id !== selectedItemId && (
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
                    onLongPress={() => handleLongPressAdd(item._id)}
                  >
                    <View className="p-1 rounded-md shadow-sm">
                      <FontAwesome6 name="add" size={22} color="white" />
                    </View>
                  </Pressable>
                )}
                {showInputAdd2 && item._id !== selectedItemId && (
                  <Pressable
                    onPress={() => handlePressAdd(item._id, "single")}
                    onLongPress={() => handleLongPressAdd(item._id)}
                  >
                    <View className="p-1 rounded-md shadow-sm">
                      <FontAwesome6 name="add" size={22} color="white" />
                    </View>
                  </Pressable>
                )}
                {/* Historial Button */}
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/ProductDetail",
                      params: {
                        product: JSON.stringify(item),
                      },
                    })
                  }
                >
                  <View className="p-1 rounded-md shadow-sm">
                    <FontAwesome5 name="history" size={24} color="#eab308" />
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
          {showOptionsModal && (
            <ModalProducts
              showOptionsModal={showOptionsModal}
              setShowOptionsModal={setShowOptionsModal}
              onDelete={confirmDelete}
            />
          )}
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
          <View className="w-16 h-16 bg-yellow-500 rounded-full shadow-lg items-center justify-center">
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
    backgroundColor: "white", // Transparent background
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
    color: "black", // White text for list items
  },
  buttonContainer: {
    width: "auto", // Ancho del contenedor del botón
    borderRadius: 20, // Bordes redondeados del contenedor
    overflow: "hidden",
  },
});
export default Products;
