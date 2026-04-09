import { Modal, View, Text, TouchableOpacity, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ExpenseFilters } from "../app/api/expenses";
import { ExpenseCategory } from "../app/api/expense-categories";

interface ExpenseFilterModalProps {
  visible: boolean;
  filters: ExpenseFilters;
  setFilters: (filters: ExpenseFilters) => void;
  onClose: () => void;
  categories?: ExpenseCategory[];
}

// Flatten categories for display
const flattenCategories = (categories: ExpenseCategory[], level = 0): (ExpenseCategory & { level: number })[] => {
  const result: (ExpenseCategory & { level: number })[] = [];
  categories.forEach((cat) => {
    result.push({ ...cat, level });
    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategories(cat.children, level + 1));
    }
  });
  return result;
};

export const ExpenseFilterModal = ({
  visible,
  filters,
  setFilters,
  onClose,
  categories = [],
}: ExpenseFilterModalProps) => {
  const flatCategories = flattenCategories(categories);

  const handleCategorySelect = (categoryId: number | null) => {
    setFilters({ expenseCategoryId: categoryId });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/70 justify-end">
        <View className="bg-[#272727] rounded-t-2xl p-5 pb-8 max-h-[80%]">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-xl font-bold">Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#aaaaaa" />
            </TouchableOpacity>
          </View>

          {/* Category Filter */}
          {categories.length > 0 && (
            <>
              <Text className="text-[#aaaaaa] text-sm font-medium mb-2">
                Categoría
              </Text>
              <View className="flex-row gap-2 mb-4 flex-wrap">
                <Pressable
                  className={`py-2 px-3 rounded-lg border ${
                    !filters.expenseCategoryId
                      ? "bg-[#F59E0B] border-[#F59E0B]"
                      : "bg-[#3f3f3f] border-[#3f3f3f]"
                  }`}
                  onPress={() => handleCategorySelect(null)}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      !filters.expenseCategoryId ? "text-black" : "text-white"
                    }`}
                  >
                    Todas
                  </Text>
                </Pressable>
                {flatCategories.slice(0, 10).map((cat) => (
                  <Pressable
                    key={cat.id}
                    className={`py-2 px-3 rounded-lg border ${
                      filters.expenseCategoryId === cat.id
                        ? "bg-[#F59E0B] border-[#F59E0B]"
                        : "bg-[#3f3f3f] border-[#3f3f3f]"
                    }`}
                    onPress={() => handleCategorySelect(cat.id)}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        filters.expenseCategoryId === cat.id ? "text-black" : "text-white"
                      }`}
                      numberOfLines={1}
                    >
                      {cat.level > 0 ? "  " : ""}{cat.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {/* Status Filter */}
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

          {/* Clear Filters */}
          <TouchableOpacity
            className="py-3 border border-[#3f3f3f] rounded-lg"
            onPress={() => {
              setFilters({
                fromDate: null,
                toDate: null,
                categoryId: null,
                expenseCategoryId: null,
                status: null,
              });
            }}
          >
            <Text className="text-white text-center font-medium">Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};