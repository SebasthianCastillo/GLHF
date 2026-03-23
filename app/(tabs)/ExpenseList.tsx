import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useExpenses } from "../../hooks/useExpenses";
import { useExpenseStore } from "../../store/useExpenseStore";
import { Expense } from "../api/expenses";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_COLORS = {
  PENDING: "#FFA500",
  PAID: "#2ba640",
  OVERDUE: "#ef4444",
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (amount: number) => {
  return `$${amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`;
};

export default function ExpenseList() {
  const router = useRouter();
  const { expenses, isLoading, isError, refetchExpenses } = useExpenses();
  const { filters, setFilters, clearFilters } = useExpenseStore();
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchExpenses();
    setRefreshing(false);
  };

  const handleExpensePress = (expense: Expense) => {
    router.push(`/AddExpense?id=${expense.id}` as any);
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      className="bg-[#272727] rounded-2xl p-4 mb-3"
      onPress={() => handleExpensePress(item)}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white font-semibold text-base">
          {item.categoryName || "Sin categoría"}
        </Text>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: STATUS_COLORS[item.status] + "20" }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: STATUS_COLORS[item.status] }}
          >
            {item.status}
          </Text>
        </View>
      </View>
      <View className="mb-3">
        <Text className="text-white text-2xl font-bold">
          {formatAmount(item.amount)}
        </Text>
        {item.description && (
          <Text className="text-[#aaaaaa] text-sm mt-1" numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      <View className="flex-row justify-between border-t border-[#3f3f3f] pt-3">
        <Text className="text-[#aaaaaa] text-xs">
          Fecha: {formatDate(item.date)}
        </Text>
        <Text className="text-[#aaaaaa] text-xs">
          Vence: {formatDate(item.dueDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const FilterModal = () => (
    <Modal visible={showFilters} animationType="slide" transparent>
      <View className="flex-1 bg-black/70 justify-end">
        <View className="bg-[#272727] rounded-t-2xl p-5 pb-8">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-xl font-bold">Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
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

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 py-4 rounded-lg border border-[#3f3f3f] items-center"
              onPress={clearFilters}
            >
              <Text className="text-white font-medium">Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#F59E0B] rounded-lg py-4 items-center"
              onPress={() => setShowFilters(false)}
            >
              <Text className="text-black font-semibold">Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#0f0f0f] justify-center items-center">
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-[#0f0f0f] justify-center items-center px-8">
        <Text className="text-[#ef4444] text-base mb-4 text-center">
          Error al cargar gastos
        </Text>
        <TouchableOpacity
          className="bg-[#F59E0B] px-6 py-3 rounded-lg"
          onPress={refetchExpenses}
        >
          <Text className="text-black font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0f0f0f]">
      {/* Header */}
      <View className="bg-[#0f0f0f] border-b border-[#3f3f3f] px-4 py-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold">Gastos</Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="p-2 bg-[#272727] rounded-lg"
              onPress={() => setShowFilters(true)}
            >
              <Ionicons name="filter-outline" size={20} color="#aaaaaa" />
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 bg-[#F59E0B] rounded-lg"
              onPress={() => router.push("/AddExpense" as any)}
            >
              <Text className="text-black font-semibold text-sm">
                + Agregar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {expenses && expenses.length > 0 ? (
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#F59E0B"
            />
          }
        />
      ) : (
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-20 h-20 rounded-full bg-[#272727] items-center justify-center mb-4">
            <Ionicons name="wallet-outline" size={40} color="#aaaaaa" />
          </View>
          <Text className="text-[#aaaaaa] text-base text-center mb-4">
            No hay gastos registrados
          </Text>
          <TouchableOpacity
            className="bg-[#F59E0B] px-6 py-3 rounded-lg"
            onPress={() => router.push("/AddExpense" as any)}
          >
            <Text className="text-black font-semibold">
              Agregar tu primer gasto
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FilterModal />
    </SafeAreaView>
  );
}
