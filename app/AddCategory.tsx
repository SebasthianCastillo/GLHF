import CustomField from "@/components/Field";
import CustomButton from "@/components/Button";
import {
  View,
  ScrollView,
  Alert,
  SafeAreaView,
  useState,
  axios,
  Constants,
  Dimensions,
  useRouter,
  TouchableOpacity,
  FontAwesome6,
  Text,
} from "../app/shared"; // Centralized imports

const API_URL =
  Constants.manifest?.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

const AddCategory = () => {
  const [name, setName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const HandleRegister = () => {
    const categoriesData = {
      Name: name,
    };

    axios
      .post(`${API_URL}/addCategory`, categoriesData)
      .then((response) => {
        setName("");
        setSuccessMessage("Categoría Agregada");
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      })
      .catch((error) => {
        console.log(categoriesData);
        Alert.alert("Error");
        console.log("Error adding category", error);
        router.push("/");
      });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row items-center p-4 bg-primary">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View
          className="w-full flex justify-center px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <CustomField
            title="Categoría"
            value={name}
            onChangeText={(text: any) => setName(text)}
            otherStyles="mt-10"
            placeholder="Nombre Categoría"
          />
          <View className="flex justify-center items-center p-5">
            {successMessage ? (
              <Text className="text-green-600 font-extrabold text-sm text">
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

export default AddCategory;
