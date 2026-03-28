import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ExpenseFilters } from "../app/api/expenses";

interface ExpenseFilterModalProps {
  visible: boolean;
  filters: ExpenseFilters;
  setFilters: (filters: ExpenseFilters) => void;
  onClose: () => void;
}

export const ExpenseFilterModal = ({
  visible,
  filters,
  setFilters,
  onClose,
}: ExpenseFilterModalProps) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View className="flex-1 bg-black/70 justify-end">
      <View className="bg-[#272727] rounded-t-2xl p-5 pb-8">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-white text-xl font-bold">Filtros</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#aaaaaa" />
          </TouchableOpacity>
        </View>

        <Text className="text-[#aaaaaa] text-sm font-medium mb-2">
          Estado
        </Text>
        <View className="flex-row gap-2 mb-6">
          {["PENDING", "PAID", "OVERDUE"].map((status) => (
            <Pressable
              key={status}
              className={`flex-1 py-3 rounded-lg border ${
                filters.status === status
                  ? "bg-[#F59E0B] border-[#F59E0B]"
                  : "bg-[#3f3f3f] border-[#3f3f3f]"
              }`}
              onPress={() =>
                setFilters({
                  status: filters.status === status ? null : (status as any),
                })
              }
            >
              <Text
                className={`text-center text-xs font-semibold ${
                  filters.status === status ? "text-black" : "text-white"
                }`}
              >
                {status}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  </Modal>
);
