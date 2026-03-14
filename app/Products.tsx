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
  TouchableOpacity,
  Alert,
  SafeAreaView,
  useState,
  router,
  useLocalSearchParams,
  FontAwesome6,
  React,
} from "./lib/shared";

import SearchBar from "@/components/SearchBar";
import { useProducts } from "@/hooks/useProducts";
import { useFilePdfDownload } from "@/hooks/useFilePdfDownload";
import RouterBackArrow from "@/components/RouterBackArrow";
import { useSelectedValuesFormatPicker } from "@/store/useSelectedIdProduct";
import FormatPicker from "@/components/FormatPicker";
import LoadingIndicator from "@/components/LoadingIndicator";

const Products = () => {
  const { category } = useLocalSearchParams();
  const categoryObject = Array.isArray(category)
    ? JSON.parse(category[0])
    : JSON.parse(category || "{}");
  const [CantidadProducto, setCantidadProducto] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false); // Para mostrar el menú de opciones
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);
  const [inputVisibility, setInputVisibility] = useState({
    showCant: true,
    showCustomCant: false,
    showSecondCant: false,
    isOnAdd: false,
  });
  let CategoryName = categoryObject.Name;

  const [showFormatPicker, setShowFormatPicker] = useState(false);

  const { productsQuery, updateQuantityProduct, modifyProduct, deleteProduct } =
    useProducts(categoryObject._id);

  //hook for selected value format picker and selected product id
  const { selectedValuesFormatPicker, setSelectedProductId } =
    useSelectedValuesFormatPicker();
  const { data: products, isLoading, isError } = productsQuery;

  // mutation for update quantity product
  const { mutate: mutateQuantity } = updateQuantityProduct;

  // hook to download Product list PDF
  const { downloadProductListPdf, isLoadingPdfDownload } = useFilePdfDownload();
  // Funcion Sumar cantidad de producto
  const handlePressAdd = (
    idProducto: any,
    fromWhatQuantityCallfunction: string,
  ) => {
    const product = products?.find((p: any) => p._id === idProducto);
    const cost = product?.cost || 0;

    const quantityProduct =
      fromWhatQuantityCallfunction === "single" ? 1 : CantidadProducto;
    let operation = "add";
    const ProductData = {
      id: idProducto,
      qty: quantityProduct,
      format: selectedValuesFormatPicker?.[idProducto] || "P",
      operation,
      cost,
    };

    mutateQuantity(ProductData);
    handlePressOutside();
  };

  // Funcion Resta cantidad de producto
  const handlePressMinus = (
    idProducto: any,
    fromWhatQuantityCallfunction: string,
  ) => {
    const quantityProduct =
      fromWhatQuantityCallfunction === "single" ? 1 : CantidadProducto;
    let operation = "minus";
    const ProductData = {
      id: idProducto,
      qty: quantityProduct,
      format: selectedValuesFormatPicker?.[idProducto] || "P",
      operation,
    };

    mutateQuantity(ProductData);
    handlePressOutside();
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
      ],
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
  const filteredProducts = (products ?? []).filter((product: any) =>
    product.Name.toString().toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <SafeAreaView className="bg-black flex-1">
        <View className="bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800">
          <View className="flex-row items-center px-4 py-3">
            <View className="flex-row items-center flex-1">
              <RouterBackArrow />
              <Text className="text-white text-lg font-bold tracking-tight ml-3">
                {CategoryName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "../ProductStockValues",
                  params: { category: JSON.stringify(categoryObject) },
                })
              }
              className="w-10 h-9 rounded-lg justify-center items-center mr-2 bg-amber-500"
            >
              <FontAwesome6 name="dollar-sign" size={18} color="white" />
            </TouchableOpacity>
            <View className="pt-2">
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            </View>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          <View className="pt-4 space-y-4 pb-24">
            {filteredProducts.map((item: any) => (
              <View
                className="flex-row justify-between items-center bg-neutral-900 p-3"
                key={item._id}
              >
                <Pressable
                  onPress={() => handleLongPressProduct(item._id, item.Name)}
                  className="flex-1 flex-row items-center mr-2"
                >
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-base text-white font-semibold">
                        {item.Name}
                      </Text>
                      <FontAwesome6
                        name="ellipsis-vertical"
                        size={16}
                        color="#737373"
                        className="ml-2"
                      />
                    </View>
                    {item.totalSpent > 0 && (
                      <Text className="text-xs text-gray-400">
                        Total gastado: $
                        {item.totalSpent.toLocaleString("es-CL")}
                      </Text>
                    )}
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setSelectedProductId(item._id);
                    setShowFormatPicker(true);
                  }}
                  className="w-9 h-9 bg-neutral-800 rounded-lg justify-center items-center border border-neutral-700"
                >
                  <Text className="text-amber-500 text-sm font-semibold">
                    {selectedValuesFormatPicker?.[item._id] || "P"}
                  </Text>
                </Pressable>
                <FormatPicker
                  showFormatPicker={showFormatPicker}
                  setShowFormatPicker={setShowFormatPicker}
                />

                <Pressable
                  onPress={() => handlePressMinus(item._id, "single")}
                  onLongPress={() => toggleSignVisibility(item._id, false)}
                  className={`w-9 h-9 rounded-lg bg-neutral-800 justify-center items-center mx-2 ${
                    pressedItemId === item._id ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <FontAwesome6 name="minus" size={18} color="white" />
                </Pressable>

                {inputVisibility.showCustomCant &&
                  item._id === selectedItemId && (
                    <View className="rounded-lg space-y-1 mr-1">
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

                {(inputVisibility.showCant ||
                  inputVisibility.showSecondCant) && (
                  <View className="w-12 mr-2 items-center">
                    <Text className="text-white font-bold text-base">
                      {item.quantity}
                    </Text>
                    {item.cost > 0 && (
                      <Text className="text-amber-500 text-xs font-medium">
                        ${(item.quantity * item.cost).toLocaleString("es-CL")}
                      </Text>
                    )}
                  </View>
                )}

                <Pressable
                  onPress={() => handlePressAdd(item._id, "single")}
                  onLongPress={() => toggleSignVisibility(item._id, true)}
                  className={`w-9 h-9 rounded-lg bg-neutral-800 justify-center items-center mr-2 ${
                    pressedItemId === item._id ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <FontAwesome6 name="add" size={18} color="white" />
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "../ProductDetail",
                      params: { product: JSON.stringify(item) },
                    })
                  }
                  className="w-9 h-9 rounded-lg bg-neutral-800 justify-center items-center"
                >
                  <FontAwesome5 name="history" size={18} color="#F59E0B" />
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

        <View className="absolute bottom-6 left-6 right-6 flex-row justify-between">
          {isLoadingPdfDownload ? (
            <LoadingIndicator />
          ) : (
            <TouchableOpacity
              className="w-14 h-14 rounded-full bg-green-600 shadow-lg shadow-green-600/30 justify-center items-center"
              activeOpacity={0.8}
              onPress={() => downloadProductListPdf(categoryObject._id)}
            >
              <FontAwesome5 name="file-pdf" size={22} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="w-14 h-14 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30 justify-center items-center"
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "../AddProduct",
                params: {
                  CategoryKey: categoryObject._id,
                  CategoryName: CategoryName,
                },
              })
            }
          >
            <FontAwesome6 name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>
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
