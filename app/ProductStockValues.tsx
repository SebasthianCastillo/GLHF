import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  useState,
  router,
  useLocalSearchParams,
  FontAwesome6,
  TextInput,
} from "./lib/shared";
import SearchBar from "@/components/SearchBar";
import { useProducts } from "@/hooks/useProducts";
import RouterBackArrow from "@/components/RouterBackArrow";
import LoadingIndicator from "@/components/LoadingIndicator";
import InfoModal from "@/components/InfoModal";
import { Ionicons } from "@expo/vector-icons";

const ProductStockValues = () => {
  const { category } = useLocalSearchParams();
  const categoryObject = Array.isArray(category)
    ? JSON.parse(category[0])
    : JSON.parse(category || "{}");

  const [searchQuery, setSearchQuery] = useState("");
  const [tempCost, setTempCost] = useState<Record<string, string>>({});
  const [showInfo, setShowInfo] = useState(false);

  const { getProducts, updateProductCost } = useProducts(categoryObject.id);
  const { data: products, isLoading } = getProducts();

  const filteredProducts = (products ?? []).filter((product: any) =>
    product.name
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLocaleString().toLowerCase()),
  );

  const formatCurrencyCLP = (value: number) => {
    if (!value || value === 0) return "$0";
    return "$" + value.toLocaleString("es-CL");
  };

  const handleCostChange = (productId: string, value: string) => {
    setTempCost((prev) => ({ ...prev, [productId]: value }));
    const costValue = parseFloat(value) || 0;
    updateProductCost.mutate({ id: productId, cost: costValue });
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        <View className="bg-neutral-900/80 backdrop-blur-xl  px-4 py-4">
          <View className="flex-row items-center justify-between">
            <RouterBackArrow />

            <Text className="text-white text-lg font-bold">Valor de stock</Text>
            <View className="flex-row items-center">
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
              <TouchableOpacity
                onPress={() => setShowInfo(true)}
                className="ml-2 w-8 h-8 rounded-full bg-neutral-700 justify-center items-center"
              >
                <Ionicons name="help-circle-outline" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          <View className="pt-4 space-y-3 pb-24">
            {filteredProducts.map((item: any) => (
              <View key={item.id} className="bg-neutral-900 p-4 ">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-white text-base font-semibold">
                    {item.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-amber-500 font-medium">
                      {item.quantity}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-1">Cant</Text>
                  </View>
                </View>

                <View className="h-px bg-neutral-800 mb-3" />

                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-400 text-sm">
                    Costo por unidad:
                  </Text>
                  <View className="flex-row items-center bg-neutral-800 rounded-lg px-2 py-1.5">
                    <Text className="text-amber-500 text-sm">$</Text>
                    <TextInput
                      value={
                        tempCost[item.id] !== undefined
                          ? tempCost[item.id]
                          : String(item.cost || 0)
                      }
                      onChangeText={(text: string) =>
                        handleCostChange(item.id, text)
                      }
                      placeholder="0"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      className="text-white text-sm text-center w-20 ml-1"
                    />
                  </View>
                </View>

                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-gray-500 text-xs">Valor stock:</Text>
                  <Text className="text-amber-400 text-sm font-medium">
                    {formatCurrencyCLP(item.quantity * (item.cost || 0))}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-500 text-xs">Total gastado:</Text>
                  <Text className="text-green-400 text-sm font-medium">
                    {formatCurrencyCLP(item.totalSpent || 0)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          {isLoading && (
            <View className="py-10">
              <LoadingIndicator />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <InfoModal
        visible={showInfo}
        onClose={() => setShowInfo(false)}
        title="¿Qué es Valor de Stock?"
        message="Aquí puedes establecer el costo por unidad de cada producto. Este valor se aplicará automáticamente al agregar más unidades."
      />
    </View>
  );
};

export default ProductStockValues;
