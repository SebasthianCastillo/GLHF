import CustomField from "@/components/Field";
import CustomButton from "@/components/Button";
import {
  View,
  ScrollView,
  Text,
  Alert,
  SafeAreaView,
  useState,
  axios,
  Constants,
  useLocalSearchParams,
  Dimensions,
} from "../app/shared"; // Centralized imports

const API_URL =
  Constants.manifest?.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

const AddProduct = () => {
  const [ProductName, setProductName] = useState("");
  const [quantityProduct, setquantityProduct] = useState(0);
  const { CategoryKey } = useLocalSearchParams();
  const { CategoryName } = useLocalSearchParams();
  const [CategoryID, setCategoryID] = useState("");

  //Funcion que añade nuevo producto
  const HandleRegister = () => {
    const ProductData = {
      Name: ProductName,
      quantity: quantityProduct,
      CategoryID: CategoryKey,
    };
    axios
      .post(`${API_URL}/addProduct`, ProductData)
      .then((response) => {
        Alert.alert("Producto Agregado 💾");
        setProductName("");
        setCategoryID("");
        // router.push("/");
      })
      .catch((error) => {
        console.log(ProductData);
        Alert.alert("Error");
        console.log("Error adding product", error);
      });
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="justify-center items-center">
        <Text className="text-slate-50">{`Categoría: ${CategoryName}`}</Text>
      </View>
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <CustomField
            title="Nombre Producto"
            value={ProductName}
            onChangeText={(ProductName: any) => setProductName(ProductName)}
            otherStyles="mt-10"
            placeholder="Nombre Producto"
          />

          <View className="p-20">
            <CustomButton
              containerStyles="w-full"
              text="Agregar"
              HandlePress={HandleRegister}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProduct;
