import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

type TransactionDayItemProps = {
  item: {
    date: string;
    dateObj: Date;
    added: number;
    removed: number;
    transactions: Array<{
      _id: string;
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
    <View className="mb-2">
      <TouchableOpacity
        onPress={() => onToggleExpand(item.date)}
        className={`flex-row justify-between items-center p-4 rounded-lg ${
          isToday ? "bg-blue-900/30" : "bg-gray-700"
        }`}
      >
        <View className="flex-row items-center">
          <Text className="text-white text-lg font-bold mr-2">{day}</Text>
          <Text className="text-gray-300">{month}</Text>
          {isToday && (
            <Text className="ml-2 px-2 py-0.5 bg-yellow-500 text-xs text-white rounded-full">
              Hoy
            </Text>
          )}
        </View>
        <View className="flex-row items-center space-x-14">
          <Text className="text-emerald-400 font-bold text-xl">
            {item.added}
          </Text>
          <Text className="text-red-400 font-bold text-xl">{item.removed}</Text>
          <FontAwesome6
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="white"
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="mt-1 bg-gray-700 rounded-b-lg overflow-hidden">
          {item.transactions.map((transaction) => (
            <View
              key={transaction._id}
              className={`p-2 ${
                transaction.operation === "add"
                  ? "bg-emerald-600"
                  : "bg-red-500"
              }`}
            >
              <View className="flex-row h-9">
                <View className="flex-1 items-center justify-center border-r border-gray-300">
                  <Text className="text-lg font-bold text-white">
                    {transaction.operation === "add" ? "+" : "-"}{" "}
                    {transaction.quantity}
                  </Text>
                </View>
                <View className="flex-1 items-center justify-center border-r border-gray-300">
                  <Text className="text-lg font-bold text-white">
                    {transaction.format}
                  </Text>
                </View>
                <View className="flex-1 items-center justify-center">
                  <Text className="text-sm font-medium text-white">
                    {new Date(transaction.date).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
