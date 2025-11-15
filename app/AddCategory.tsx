import CustomField from "@/components/Field";
import CustomButton from "@/components/Button";
import {
  View,
  ScrollView,
  SafeAreaView,
  useState,
  Dimensions,
  Text,
} from "./lib/shared"; // Centralized imports
import RouterBackArrow from "@/components/RouterBackArrow";
import { useCategories } from "@/hooks/useCategories";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { addCategory } = useCategories();

  const HandleRegisterButton = () => {
    addCategory.mutate(name, {
      onSuccess: () => {
        setName("");
        setSuccessMessage("Categoría agregada");
        setTimeout(() => setSuccessMessage(""), 3000);
      },
      onError: (error: any) => {
        console.log("Error adding category:", error);
        setSuccessMessage("Error al agregar categoría");
        setTimeout(() => setSuccessMessage(""), 3000);
      },
    });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row items-center p-4 bg-primary">
        <RouterBackArrow />
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
              HandlePress={HandleRegisterButton}
              size="text-base"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCategory;
