import CustomField from "@/components/Field";
import CustomButton from "@/components/Button";
import {
  View,
  SafeAreaView,
  useState,
  Text,
  ActivityIndicator,
} from "./lib/shared";
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
    <SafeAreaView className="bg-[#0f0f0f] h-full">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-[#3f3f3f]">
        <RouterBackArrow />
        <Text className="text-white text-xl font-bold ml-3">
          Nueva Categoría
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-8">
        <Text className="text-[#aaaaaa] text-sm mb-3 font-medium">
          Nombre de categoría
        </Text>
        <CustomField
          title=""
          value={name}
          onChangeText={(text: any) => setName(text)}
          otherStyles=""
          placeholder="Ej: Gastos del hogar"
        />

        {/* Success/Error message */}
        {successMessage && (
          <Text 
            className={`mt-3 font-semibold text-sm ${
              successMessage.includes("Error") 
                ? "text-[#ef4444]" 
                : "text-[#2ba640]"
            }`}
          >
            {successMessage}
          </Text>
        )}

        {/* Button */}
        <View className="mt-auto pb-8">
          {addCategory.isPending ? (
            <View className="w-full bg-[#F59E0B] rounded-lg py-4 items-center justify-center">
              <ActivityIndicator color="white" size="small" />
            </View>
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
    </SafeAreaView>
  );
};

export default AddCategory;
