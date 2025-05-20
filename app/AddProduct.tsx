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
  router,
  TouchableOpacity,
  FontAwesome6,
} from "../app/shared"; // Centralized imports

const API_URL =
  Constants.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

const AddProduct = () => {
  const [ProductName, setProductName] = useState("");
  const [quantityProduct, setquantityProduct] = useState(0);
  const { CategoryKey } = useLocalSearchParams();
  const { CategoryName } = useLocalSearchParams();
  const [CategoryID, setCategoryID] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
        setSuccessMessage("Producto Agregado");
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
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
      <View className="flex-row items-center p-4 bg-primary">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">{CategoryName}</Text>
      </View>
      {/* <View className="justify-center items-center">
        <Text className="text-slate-50">{`Categoría: ${CategoryName}`}</Text>
      </View> */}
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
          <View className="flex justify-center items-center p-5">
            {successMessage ? (
              <Text className="text-green-600 font-extrabold text-sm">
                {successMessage}
              </Text>
            ) : (
              <Text className="">{}</Text>
            )}
          </View>
          <View className="pt-14 pl-28 pr-28 pb-16">
            <CustomButton
              containerStyles="w-full"
              text="Agregar"
              HandlePress={HandleRegister}
              size="text-base"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProduct;
