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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useExpenses } from "../../hooks/useExpenses";
import { useExpenseCategories } from "../../hooks/useExpenseCategories";
import { useExpenseStore } from "../../store/useExpenseStore";
import { Expense } from "../api/expenses";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExpenseFilterModal } from "../../components/ExpenseFilterModal";
import PayExpenseModal from "../../components/PayExpenseModal";
import RouterBackArrow from "../../components/RouterBackArrow";
import InfoModal from "../../components/InfoModal";
import SearchBar from "../../components/SearchBar";

const STATUS_COLORS = {
  PENDING: "#FFA500",
  PAID: "#2ba640",
  OVERDUE: "#ef4444",
  PARTIAL: "#3b82f6",
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
  return `$${amount.toLocaleString("es-ES", { maximumFractionDigits: 0 })}`;
};

export default function ExpenseList() {
  const router = useRouter();
  const {
    expenses,
    isLoading,
    isFetching,
    isError,
    refetchExpenses,
    payExpenseAsync,
    isPaying,
  } = useExpenses();
  const { categories } = useExpenseCategories();
  const { filters, setFilters } = useExpenseStore();
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered expenses based on search query
  const filteredExpenses = (expenses ?? []).filter((expense: Expense) => {
    const query = searchQuery.toLowerCase();
    return (
      (expense.categoryName || "").toLowerCase().includes(query) ||
      (expense.description || "").toLowerCase().includes(query) ||
      expense.amount.toString().includes(query)
    );
  });

  const handlePayExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowPayModal(true);
  };

  const handlePaySuccess = () => {
    setShowPayModal(false);
    setSelectedExpense(null);
    Alert.alert("Éxito", "Pago registrado correctamente");
  };

  const handlePay = async (amount: number) => {
    if (!selectedExpense) return;
    await payExpenseAsync({ expenseId: selectedExpense.id, amount });
  };

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
      className="bg-[#272727] p-4 border-b border-[#3f3f3f]"
      onPress={() => handleExpensePress(item)}
    >
      <View className="flex-row items-center">
        <Text
          className="text-white font-semibold text-sm flex-1"
          numberOfLines={1}
        >
          {item.categoryName || "Sin categoría"}
        </Text>
        {item.description && (
          <Text
            className="text-[#aaaaaa] text-sm flex-1 ml-2"
            numberOfLines={1}
          >
            {item.description}
          </Text>
        )}
        <Text className="text-white text-sm font-bold ml-2">
          {formatAmount(item.amount)}
        </Text>
        {item.status !== "PAID" && (
          <TouchableOpacity
            onPress={() => handlePayExpense(item)}
            className="p-1.5 bg-green-600/20 rounded ml-2"
          >
            <Ionicons name="card-outline" size={14} color="#2ba640" />
          </TouchableOpacity>
        )}
        <View
          className="px-2.5 py-1 rounded-full ml-2"
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
      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-[#aaaaaa] text-xs">{formatDate(item.date)}</Text>
        <Text className="text-[#aaaaaa] text-xs">
          Vence: {formatDate(item.dueDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="bg-[#0f0f0f] px-4 py-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <RouterBackArrow />
            <Text className="text-white text-xl font-bold">Gastos</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            <TouchableOpacity
              className="p-2 bg-[#272727] rounded-lg"
              onPress={() => router.push("/ExpenseCategories" as any)}
            >
              <Ionicons name="folder-outline" size={20} color="#aaaaaa" />
            </TouchableOpacity>
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

      {/* Inline loading indicator */}
      {(isFetching || isLoading) && (
        <View className="py-2 items-center">
          <ActivityIndicator size="small" color="#F59E0B" />
        </View>
      )}

      {filteredExpenses && filteredExpenses.length > 0 ? (
        <FlatList
          data={filteredExpenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#F59E0B"
            />
          }
        />
      ) : !isLoading ? (
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
      ) : null}

      <ExpenseFilterModal
        visible={showFilters}
        filters={filters}
        setFilters={setFilters}
        onClose={() => setShowFilters(false)}
        categories={categories}
      />

      <PayExpenseModal
        visible={showPayModal}
        expense={selectedExpense}
        onClose={() => {
          setShowPayModal(false);
          setSelectedExpense(null);
        }}
        onSuccess={handlePaySuccess}
        onPay={handlePay}
        isLoading={isPaying}
      />

      <InfoModal
        visible={showInfo}
        onClose={() => setShowInfo(false)}
        title="¿Qué es esta pantalla?"
        message="Aquí puedes ver y gestionar tus gastos. Cada gasto muestra la categoría, descripción, monto y fecha de vencimiento. Toca el ícono de tarjeta para registrar un pago."
      />
    </SafeAreaView>
  );
}
