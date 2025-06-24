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
          <View className="items-center mr-4">
            <Text className="text-white text-2xl font-bold">{day}</Text>
            <Text className="text-gray-300 text-xs">{month}</Text>
          </View>
          <View>
            <Text className="text-white font-medium">
              {item.dateObj.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
            {isToday && (
              <Text className="text-yellow-400 text-xs">Hoy</Text>
            )}
          </View>
        </View>
        <View className="flex-row items-center space-x-4">
          <Text className="text-emerald-400 font-bold text-lg">
            +{item.added}
          </Text>
          <Text className="text-red-400 font-bold text-lg">-{item.removed}</Text>
          <FontAwesome6
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="white"
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="mt-2 bg-gray-800 rounded-lg p-3">
          {item.transactions.map((transaction) => (
            <View
              key={transaction._id}
              className="flex-row justify-between items-center py-2 border-b border-gray-700 last:border-0"
            >
              <View>
                <Text className="text-white">
                  {new Date(transaction.date).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text className="text-gray-400 text-xs">
                  {transaction.format}
                </Text>
              </View>
              <Text
                className={`font-bold ${
                  transaction.operation === "add"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {transaction.operation === "add" ? "+" : "-"}
                {transaction.quantity}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
