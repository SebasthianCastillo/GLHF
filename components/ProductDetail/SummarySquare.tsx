import { View, Text } from "react-native";
import { useSummaryStore } from "../../store/useSummaryStore";

const SummarySquare = () => {
  const { productDetailSummaryAdd, productDetailSummaryMinus } = useSummaryStore();

  return (
    <View className="flex-row justify-between mt-4">
      <View className="h-16 w-32">
        <View className="flex-1 items-center justify-center bg-emerald-600 rounded-lg shadow-lg p-4">
          <Text className="text-3xl font-bold text-white">
            {productDetailSummaryAdd}
          </Text>
        </View>
      </View>
      {/* <View className="h-24 w-32">
          <View className="flex-1 items-center justify-center bg-yellow-500 rounded-lg shadow-lg p-4">
            <Text className="text-3xl font-bold text-white pt-5">
              {productDetailSummaryAdd - productDetailSummaryMinus}
            </Text>
            <Text className="text-center pt-1 ">Disponible</Text>
          </View>
        </View> */}
      <View className="h-16 w-32">
        <View className="flex-1 items-center justify-center bg-red-500 rounded-lg shadow-lg p-4">
          <Text className="text-3xl font-bold text-white">
            {productDetailSummaryMinus}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SummarySquare;
