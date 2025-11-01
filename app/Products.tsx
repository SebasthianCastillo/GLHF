import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomField from "@/components/Field";
import ModalProducts from "@/components/OptionModal";
import {
  View,
  ScrollView,
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
  useLocalSearchParams,
  useFocusEffect,
  React,
  Modal,
  FontAwesome6,
  ActivityIndicator,
} from "./lib/shared"; // Centralized imports
import ButtonLink from "@/components/ButtonLink";
import SearchBar from "@/components/SearchBar";
import { useProducts } from "@/hooks/useProducts";
import { useFilePdfDownload } from "@/hooks/useFilePdfDownload";
import RouterBackArrow from "@/components/RouterBackArrow";

const Products = () => {
  const { category } = useLocalSearchParams();
  const categoryObject = Array.isArray(category)
    ? JSON.parse(category[0])
    : JSON.parse(category || "{}");
  const [CantidadProducto, setCantidadProducto] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");

  const [formatValue, setFormatValue] = useState("P");
  const [items, setItems] = useState([
    { label: "P", value: "P" },
    { label: "KG", value: "KG" },
    { label: "GR", value: "GR" },
  ]);

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

  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const {
    products, // Funcion que trae los productos segun categoria
    isRefreshing,
    fetchProducts,
    refreshProducts,
    addProductDetail,
    modifyProduct,
    deleteProduct, //funcion para eliminar producto
  } = useProducts(categoryObject._id);

  // hook to download Product list PDF
  const { downloadProductListPdf, isLoadingPdfDownload } = useFilePdfDownload();

  // Funcion que trae los productos segun categoria
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Funcion Sumar cantidad de producto
  const handlePressAdd = (
    idProducto: any,
    fromWhatQuantityCallfunction: string
  ) => {
    const quantityProduct =
      fromWhatQuantityCallfunction === "single" ? 1 : CantidadProducto;
    let operation = "add";
    addProductDetail(idProducto, quantityProduct, formatValue, operation);
    handlePressOutside();
  };

  // Funcion Resta cantidad de producto
  const handlePressMinus = (
    idProducto: any,
    fromWhatQuantityCallfunction: string
  ) => {
    const quantityProduct =
      fromWhatQuantityCallfunction === "single" ? 1 : CantidadProducto;
    let operation = "minus";
    addProductDetail(idProducto, quantityProduct, formatValue, operation);
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

  type SelectedValuesType = {
    [key: string]: string; // Las claves son las ids de tipo string, y los valores también son strings
  };

  //maneja el comportamiento de los dropdown para elegir formato P, KG, GR
  const handleDropdownChange = (id: string, newValue: string) => {
    setSelectedValues((prevValues: SelectedValuesType) => ({
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

  const handleNameChange = (newName: string) => {
    if (selectedItemId) {
      modifyProduct(selectedItemId, newName);
    }
  };

  // Función para manejar el long press y mostrar las opciones
  const handleLongPressProduct = (idProducto: any, productName: string) => {
    setSelectedItemId(idProducto);
    setSelectedProductName(productName);
    setShowOptionsModal(true);
  };

  //funcion que se activa cuando se hace pull to refresh
  const onRefreshingProducts = async () => {
    fetchProducts();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  //funcion que maneja el comportamiento visual de los signos + y - al hacer long press
  const toggleSignVisibility = (id: string, isAdd: boolean) => {
    handlePressOutside();
    setSelectedItemId(id);
    setPressedItemId(id); // Almacena el ID de la fila presionada
    setInputVisibility((prevState: any) => ({
      ...prevState,
      showCant: !prevState.showCant,
      showCustomCant: !prevState.showCustomCant,
      showSecondCant: !prevState.showSecondCant,
      isOnAdd: isAdd,
    }));
  };

  //Simple nice and beatiful search bar filter
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProducts = products.filter((product: any) =>
    product.Name.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <SafeAreaView className="bg-primary h-full">
        <View className="flex-row items-center p-4 bg-slate-950">
          <RouterBackArrow />
          <Text className="text-white text-xl font-bold flex-1">
            {CategoryName}
          </Text>
          <View className="flex-end pt-2">
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>
        </View>
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
            {filteredProducts.map((item: any) => (
              <View className="flex-row justify-between items-center">
                <View className="w-20">
                  <Pressable
                    key={item._id}
                    onLongPress={() =>
                      handleLongPressProduct(item._id, item.Name)
                    }
                  >
                    <Text className="text-base text-white font-bold">
                      {item.Name}
                    </Text>
                  </Pressable>
                </View>
                {/* button for modal format picker */}
                <Pressable
                  onPress={() => {
                    setSelectedProductId(item._id);
                    setShowFormatPicker(true);
                  }}
                  className="w-16 h-10 bg-slate-800 rounded-md justify-center items-center"
                >
                  <Text className="text-white text-lg">
                    {selectedValues[item._id] || "P"}
                  </Text>
                </Pressable>

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
                      pathname: "../ProductDetail",
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
              onModify={() => modifyProduct(selectedItemId)}
              productName={selectedProductName}
              onNameChange={handleNameChange} //funcion con el nuevo nombre del producto por parametro
            />
          )}
        </ScrollView>
        <ButtonLink
          logotype={"add"}
          backgroundColor={"bg-yellow-500"}
          onPress={() =>
            router.push({
              pathname: "../AddProduct",
              params: {
                CategoryKey: categoryObject._id,
                CategoryName: CategoryName,
              },
            })
          }
        ></ButtonLink>
        {isLoadingPdfDownload ? (
          <View className="p-10 justify-center items-center">
            <View className="bg-green-500 w-16 h-16 rounded-full shadow-lg justify-center items-center">
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          </View>
        ) : (
          <ButtonLink
            logotype={"file-pdf"}
            backgroundColor={"bg-green-500"}
            onPress={() => downloadProductListPdf(categoryObject._id)}
          />
        )}
        <Modal
          visible={showFormatPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowFormatPicker(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-slate-800 rounded-t-3xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-lg font-bold">
                  Seleccionar Formato
                </Text>
                <Pressable onPress={() => setShowFormatPicker(false)}>
                  <Text className="text-white text-lg">✕</Text>
                </Pressable>
              </View>
              <View className="space-y-2">
                {items.map((item: any) => (
                  <Pressable
                    key={item.value}
                    onPress={() => {
                      if (selectedProductId) {
                        handleDropdownChange(selectedProductId, item.value);
                        setShowFormatPicker(false);
                      }
                    }}
                    className="bg-slate-700 p-4 rounded-lg"
                  >
                    <Text className="text-white text-center text-lg">
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </Modal>
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
