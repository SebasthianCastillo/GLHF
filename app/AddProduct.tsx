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
} from "./lib/shared"; // Centralized imports
import RouterBackArrow from "@/components/RouterBackArrow";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useProducts } from "@/hooks/useProducts";
const API_URL =
  Constants.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

const AddProduct = () => {
  const [ProductName, setProductName] = useState("");
  const [quantityProduct, setquantityProduct] = useState(0);
  const { CategoryKey } = useLocalSearchParams();
  const { CategoryName } = useLocalSearchParams();
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categoryId = CategoryKey.toString();
  const { addProduct } = useProducts(categoryId);

  // handle function for adding a product
  const HandleRegisterButton = () => {
    addProduct.mutate(
      {
        ProductName: ProductName,
        quantityProduct: quantityProduct,
        CategoryKey: CategoryKey.toString(),
      },
      {
        onSuccess: () => {
          setProductName("");
          setSuccessMessage("Producto agregado");
          setTimeout(() => setSuccessMessage(""), 3000);
        },
        onError: (error: any) => {
          console.log("Error adding product:", error);
          setSuccessMessage("Error al agregar producto");
          setTimeout(() => setSuccessMessage(""), 3000);
        },
      }
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row items-center p-4 bg-primary">
        <RouterBackArrow />
        <Text className="text-white text-xl font-bold">{CategoryName}</Text>
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
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <CustomButton
                containerStyles="w-full"
                text="Agregar"
                HandlePress={HandleRegisterButton}
                size="text-base"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProduct;
