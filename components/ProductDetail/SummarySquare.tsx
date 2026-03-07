import { View, Text } from "react-native";
import { useSummaryStore } from "../../store/useSummaryStore";

const SummarySquare = () => {
  const { productDetailSummaryAdd, productDetailSummaryMinus } = useSummaryStore();

  return (
    <View className="flex-row justify-between gap-3">
      <View className="flex-1">
        <View className="items-center justify-center bg-[#2ba640]/10 rounded-2xl p-4">
          <Text className="text-[#2ba640] text-xs font-medium mb-1 uppercase tracking-wide">
            Agregados
          </Text>
          <Text className="text-3xl font-bold text-[#2ba640]">
            {productDetailSummaryAdd}
          </Text>
        </View>
      </View>
      <View className="flex-1">
        <View className="items-center justify-center bg-red-500/10 rounded-2xl p-4">
          <Text className="text-red-500 text-xs font-medium mb-1 uppercase tracking-wide">
            Retirados
          </Text>
          <Text className="text-3xl font-bold text-red-500">
            {productDetailSummaryMinus}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SummarySquare;
