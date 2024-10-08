import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomField from "@/components/Field";
import ModalProducts from "@/components/OptionModal";
import DropDownPicker from "react-native-dropdown-picker";
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
  RefreshControl,
  SafeAreaView,
  useSafeAreaInsets,
  useState,
  useCallback,
  router,
  axios,
  Constants,
  useLocalSearchParams,
  useFocusEffect,
  React,
} from "../app/shared"; // Centralized imports

const API_URL =
  Constants.manifest?.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

const Products = () => {
  const { category } = useLocalSearchParams();
  const categoryObject = Array.isArray(category)
    ? JSON.parse(category[0])
    : JSON.parse(category || "{}");
  const [products, setProducts] = useState([]);
  const [CantidadProducto, setCantidadProducto] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [formatValues, setFormatValues] = useState<{ [key: string]: string }>(
    {}
  );

  const [formatValue, setFormatValue] = useState("P");
  const [items, setItems] = useState([
    { label: "P", value: "P" },
    { label: "KG", value: "KG" },
    { label: "GR", value: "GR" },
  ]);
  const [justifyContent, setJustifyContent] = useState("opacity-100");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<SelectedValuesType>({});
  const [showOptionsModal, setShowOptionsModal] = useState(false); // Para mostrar el menú de opciones
  const [IsRefreshing, setIsRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);
  let CategoryName = categoryObject.Name;

  const [inputVisibility, setInputVisibility] = useState({
    showCant: true,
    showCustomCant: false,
    showSecondCant: false,
    isOnAdd: false,
  });

  // Funcion que trae los productos segun categoria
  useFocusEffect(
    useCallback(() => {
      productsFunction();
    }, [])
  );
  // Funcion que trae los productos segun categoria
  const productsFunction = async () => {
    try {
      const response = await axios.get(`${API_URL}/productsByIDCategory`, {
        params: { CategoryKey: categoryObject._id },
      });
      setProducts(response.data);
    } catch (error) {
      console.log("error fetching products data", error);
    }
  };

  // Funcion Sumar cantidad de producto
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
      .post(`${API_URL}/addProductDetail`, addProductDetail)
      .then((response) => {
        quantityUpdateProduct(idProducto, quantityProduct, operation);
        productsFunction();
        handlePressOutside();
      })
      .catch((error) => {
        console.log(addProductDetail);
        console.log("Error AddProductDetail", error);
      });
  };

  // Funcion Resta cantidad de producto

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
      .post(`${API_URL}/addProductDetail`, addProductDetail)
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
      .patch(`${API_URL}/quantityUpdateProduct`, UpdateQuantityData)
      .then((response) => {
        productsFunction();
      })
      .catch((error) => {
        console.log(UpdateQuantityData);
        console.log("Error quantity update product", error);
      });
  };

  // Verifica si el toque está fuera del área del dropdown
  const handlePressOutside = () => {
    resetAllVisibility();
  };
  const resetAllVisibility = () => {
    setInputVisibility({
      showCant: true,
      showCustomCant: false,
      showSecondCant: false,
      isOnAdd: false,
    });
    setCantidadProducto(0);
    setPressedItemId("");
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
      await axios.delete(`${API_URL}/deleteProduct/${idProducto}`);
      // Refrescar la lista de productos después de eliminar
      const response = await axios.get(`${API_URL}/productsByIDCategory`, {
        params: { CategoryKey: categoryObject._id },
      });
      setProducts(response.data);
    } catch (error) {
      console.log("Error deleting product", error);
    }
  };

  //funcion que se activa cuando se hace pull to refresh
  const onRefreshingProducts = async () => {
    productsFunction();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };
  const toggleSignVisibility = (id: string, isAdd: boolean) => {
    setSelectedItemId(id);
    setPressedItemId(id); // Almacena el ID de la fila presionada
    setInputVisibility((prevState) => ({
      ...prevState,
      showCant: !prevState.showCant,
      showCustomCant: !prevState.showCustomCant,
      showSecondCant: !prevState.showSecondCant,
      isOnAdd: isAdd,
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={IsRefreshing}
              progressViewOffset={top}
              onRefresh={onRefreshingProducts}
              colors={["green", "orange"]}
            />
          }
        >
          <View className="p-4 space-y-3 bg-slate-950">
            {products.map((item: any) => (
              <View className={`flex-row justify-between items-center`}>
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
                <Pressable
                  onPress={() => handlePressMinus(item._id, "single")}
                  onLongPress={() => toggleSignVisibility(item._id, false)}
                >
                  <View
                    className={`p-1 rounded-md shadow-sm ${
                      pressedItemId === item._id ? "opacity-0" : "opacity-100"
                    }`} // Condicional para opacidad
                  >
                    <FontAwesome6 name="minus" size={22} color="white" />
                  </View>
                </Pressable>

                {/* Cant button when long press sign */}
                {inputVisibility.showCustomCant &&
                  item._id === selectedItemId && (
                    <View className="rounded-lg shadow-md space-y-1">
                      <CustomField
                        value={CantidadProducto}
                        onChangeText={(CantidadProducto: any) =>
                          setCantidadProducto(CantidadProducto)
                        }
                        placeholder="0"
                        keyboardType="numeric"
                        otherStyles=""
                      ></CustomField>

                      <View style={styles.buttonContainer}>
                        <Button
                          color="#F59E0B"
                          title={`${inputVisibility.isOnAdd ? "➕" : "➖"}`}
                          onPress={() =>
                            inputVisibility.isOnAdd
                              ? handlePressAdd(item._id, "multiple")
                              : handlePressMinus(item._id, "multiple")
                          }
                        />
                      </View>
                    </View>
                  )}

                {/* Custom Field */}
                {inputVisibility.showCant && (
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
                {inputVisibility.showSecondCant &&
                  item._id !== selectedItemId && (
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
                <Pressable
                  onPress={() => handlePressAdd(item._id, "single")}
                  onLongPress={() => toggleSignVisibility(item._id, true)}
                >
                  <View
                    className={`p-1 rounded-md shadow-sm ${
                      pressedItemId === item._id ? "opacity-0" : "opacity-100"
                    }`} // Condicional para opacidad
                  >
                    <FontAwesome6 name="add" size={22} color="white" />
                  </View>
                </Pressable>

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
