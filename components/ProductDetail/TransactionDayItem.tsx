import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

type TransactionDayItemProps = {
  item: {
    date: string;
    dateObj: Date;
    added: number;
    removed: number;
    transactions: Array<{
      id: string;
      quantity: number;
      date: string;
      format: string;
      operation: string;
      ProductID: string;
    }>;
  };
  isExpanded: boolean;
  onToggleExpand: (date: string) => void;
};

export const TransactionDayItem = ({
  item,
  isExpanded,
  onToggleExpand,
}: TransactionDayItemProps) => {
  const day = item.dateObj.getDate();
  const month = item.dateObj.toLocaleString("default", { month: "short" });
  const today = new Date();
  const isToday =
    day === today.getDate() &&
    item.dateObj.getMonth() === today.getMonth() &&
    item.dateObj.getFullYear() === today.getFullYear();

  return (
    <View className="mb-3">
      <TouchableOpacity
        onPress={() => onToggleExpand(item.date)}
        className={`flex-row justify-between items-center p-4  ${
          isToday ? "bg-[#272727]" : "bg-[#272727]/60"
        }`}
      >
        <View className="flex-row items-center">
          <View
            className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
              isToday ? "bg-[#F59E0B]" : "bg-[#3f3f3f]"
            }`}
          >
            <Text
              className={`text-lg font-bold ${isToday ? "text-black" : "text-white"}`}
            >
              {day}
            </Text>
          </View>
          <Text className="text-white/80 text-sm capitalize">{month}</Text>
          {isToday && (
            <View className="ml-2 px-2 py-0.5 bg-[#F59E0B] rounded-full">
              <Text className="text-black text-xs font-medium">Hoy</Text>
            </View>
          )}
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
          {item.transactions.map((transaction, index) => (
            <View
              key={transaction.id}
              className={`flex-row h-12 items-center px-4 ${
                transaction.operation === "add"
                  ? "bg-[#2ba640]/10"
                  : "bg-[#F59E0B]/10"
              } ${
                index !== item.transactions.length - 1
                  ? "border-b border-[#3f3f3f]"
                  : ""
              }`}
            >
              <View className="flex-1 items-center justify-center">
                <Text
                  className={`font-semibold text-base ${
                    transaction.operation === "add"
                      ? "text-[#2ba640]"
                      : "text-[#F59E0B]"
                  }`}
                >
                  {transaction.operation === "add" ? "+" : "-"}{" "}
                  {transaction.quantity}
                </Text>
              </View>
              <View className="flex-1 items-center justify-center border-l border-[#3f3f3f]">
                <Text className="text-white/80 text-sm font-medium">
                  {transaction.format}
                </Text>
              </View>
              <View className="flex-1 items-center justify-center border-l border-[#3f3f3f]">
                <Text className="text-[#aaa] text-xs">
                  {new Date(transaction.date).toLocaleTimeString([], {
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
