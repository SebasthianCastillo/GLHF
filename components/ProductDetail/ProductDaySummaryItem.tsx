import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

interface Movement {
  id: string;
  quantity: number;
  format: string;
  operation: string;
  date: string;
}

interface ProductMovement {
  productId: string;
  productName: string;
  added: number;
  removed: number;
  movements: Movement[];
}

interface ProductDaySummaryItemProps {
  item: ProductMovement;
  isExpanded: boolean;
  onToggleExpand: (productId: string) => void;
}

export const ProductDaySummaryItem = ({
  item,
  isExpanded,
  onToggleExpand,
}: ProductDaySummaryItemProps) => {
  return (
    <View className="mb-3">
      <TouchableOpacity
        onPress={() => onToggleExpand(item.productId)}
        className="flex-row justify-between items-center p-4 bg-[#272727]"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-[#3f3f3f]">
            <FontAwesome6 name="box" size={18} color="#fff" />
          </View>
          <Text className="text-white text-base font-semibold flex-1" numberOfLines={1}>
            {item.productName}
          </Text>
        </View>
        <View className="flex-row items-center gap-6">
          <View className="items-center min-w-[40px]">
            <Text className="text-[#2ba640] font-bold text-lg">
              {item.added}
            </Text>
            <Text className="text-[#aaa] text-[10px]">Agregado</Text>
          </View>
          <View className="items-center min-w-[40px]">
            <Text className="text-[#F59E0B] font-bold text-lg">
              {item.removed}
            </Text>
            <Text className="text-[#aaa] text-[10px]">Retirado</Text>
          </View>
          <View className="w-6 items-center justify-center">
            <FontAwesome6
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={14}
              color="#fff"
            />
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="mt-1 bg-[#1f1f1f] rounded-b-2xl overflow-hidden">
          {item.movements.map((movement, index) => (
            <View
              key={movement.id}
              className={`flex-row h-12 items-center px-4 ${
                movement.operation === "add"
                  ? "bg-[#2ba640]/10"
                  : "bg-[#F59E0B]/10"
              } ${
                index !== item.movements.length - 1
                  ? "border-b border-[#3f3f3f]"
                  : ""
              }`}
            >
              <View className="flex-1 items-center justify-center">
                <Text
                  className={`font-semibold text-base ${
                    movement.operation === "add"
                      ? "text-[#2ba640]"
                      : "text-[#F59E0B]"
                  }`}
                >
                  {movement.operation === "add" ? "+" : "-"}{" "}
                  {movement.quantity}
                </Text>
              </View>
              <View className="flex-1 items-center justify-center border-l border-[#3f3f3f]">
                <Text className="text-white/80 text-sm font-medium">
                  {movement.format}
                </Text>
              </View>
              <View className="flex-1 items-center justify-center border-l border-[#3f3f3f]">
                <Text className="text-[#aaa] text-xs">
                  {new Date(movement.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
