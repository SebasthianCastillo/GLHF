import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useExpenses } from "../hooks/useExpenses";
import { useCategories } from "../hooks/useCategories";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import RouterBackArrow from "@/components/RouterBackArrow";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDateForInput = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// Auto-formatear fecha mientras el usuario escribe
const formatDateInput = (text: string): string => {
  // Solo permitir números
  let cleaned = text.replace(/[^0-9]/g, "");
  
  // Limitar a 8 dígitos (YYYYMMDD)
  cleaned = cleaned.slice(0, 8);
  
  // Agregar guiones automáticamente
  if (cleaned.length >= 4) {
    cleaned = cleaned.slice(0, 4) + "-" + cleaned.slice(4);
  }
  if (cleaned.length >= 7) {
    cleaned = cleaned.slice(0, 7) + "-" + cleaned.slice(7);
  }
  
  return cleaned;
};

export default function AddExpense() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { createExpenseAsync, isCreating } = useExpenses();
  const { getCategory } = useCategories();

  const categories = getCategory.data || [];
  const isEditing = !!params.id;

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(formatDateForInput(new Date()));
  const [dueDate, setDueDate] = useState(formatDateForInput(new Date()));
  const [categoryId, setCategoryId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Date picker states
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [dueDatePickerOpen, setDueDatePickerOpen] = useState(false);

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(String(categories[0].id));
    }
  }, [categories]);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Por favor ingresa un monto válido");
      return;
    }

    if (!categoryId) {
      Alert.alert("Error", "Por favor selecciona una categoría");
      return;
    }

    if (!date) {
      Alert.alert("Error", "Por favor ingresa una fecha");
      return;
    }

    if (!dueDate) {
      Alert.alert("Error", "Por favor ingresa una fecha de vencimiento");
      return;
    }

    setLoading(true);
    try {
      await createExpenseAsync({
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        dueDate: new Date(dueDate).toISOString(),
        categoryId: parseInt(categoryId),
        description: description.trim() || undefined,
      });

      Alert.alert("Éxito", "Gasto creado correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el gasto. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f0f0f]">
      {/* Header */}
      <View className="border-b border-[#3f3f3f]">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <RouterBackArrow />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">
            {isEditing ? "Editar Gasto" : "Nuevo Gasto"}
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-[#0f0f0f]"
        keyboardShouldPersistTaps="handled"
      >
        <View className="p-4">
          {/* Amount Input */}
          <View className="mb-5">
            <Text className="text-[#aaaaaa] text-sm font-medium mb-2">
              Monto *
            </Text>
            <View className="bg-[#272727] rounded-xl border border-[#3f3f3f] px-4 py-3">
              <TextInput
                className="text-white text-xl font-semibold"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholderTextColor="#666666"
              />
            </View>
          </View>

          {/* Date Input */}
          <View className="mb-5">
            <Text className="text-[#aaaaaa] text-sm font-medium mb-2">
              Fecha *
            </Text>
            <TouchableOpacity
              className="bg-[#272727] rounded-xl border border-[#3f3f3f] px-4 py-3 flex-row items-center justify-between"
              onPress={() => setDatePickerOpen(true)}
            >
              <Text className="text-white text-base">{date}</Text>
              <Ionicons name="calendar-outline" size={20} color="#aaaaaa" />
            </TouchableOpacity>
          </View>

          {/* Due Date Input */}
          <View className="mb-5">
            <Text className="text-[#aaaaaa] text-sm font-medium mb-2">
              Fecha de Vencimiento *
            </Text>
            <TouchableOpacity
              className="bg-[#272727] rounded-xl border border-[#3f3f3f] px-4 py-3 flex-row items-center justify-between"
              onPress={() => setDueDatePickerOpen(true)}
            >
              <Text className="text-white text-base">{dueDate}</Text>
              <Ionicons name="calendar-outline" size={20} color="#aaaaaa" />
            </TouchableOpacity>
          </View>

          {/* Category Picker */}
          <View className="mb-5">
            <Text className="text-[#aaaaaa] text-sm font-medium mb-2">
              Categoría *
            </Text>
            <View className="bg-[#272727] rounded-xl border border-[#3f3f3f] overflow-hidden">
              <Picker
                selectedValue={categoryId}
                onValueChange={(value) => setCategoryId(value)}
                itemStyle={{ color: "#ffffff" }}
                style={{ color: "#ffffff", backgroundColor: "transparent" }}
              >
                {categories.map((cat: { id: number; name: string }) => (
                  <Picker.Item
                    key={cat.id}
                    label={cat.name}
                    value={String(cat.id)}
                    color="#272727"
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="text-[#aaaaaa] text-sm font-medium mb-2">
              Descripción (opcional)
            </Text>
            <View className="bg-[#272727] rounded-xl border border-[#3f3f3f] px-4 py-3">
              <TextInput
                className="text-white text-base h-24"
                placeholder="Agrega una descripción..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholderTextColor="#666666"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="px-6 pb-6">
        {/* Submit Button */}
        <TouchableOpacity
          className={`bg-[#F59E0B]  py-4 items-center ${loading || isCreating ? "opacity-70" : ""}`}
          onPress={handleSubmit}
          disabled={loading || isCreating}
        >
          {loading || isCreating ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text className="text-black font-semibold text-base">
              {isEditing ? "Actualizar" : "Crear Gasto"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          className="py-4 items-center mt-2"
          onPress={() => router.back()}
        >
          <Text className="text-[#aaaaaa] font-medium">Cancelar</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      {datePickerOpen && (
        <DateTimePicker
          value={new Date(date)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setDatePickerOpen(false);
            if (selectedDate) {
              setDate(formatDateForInput(selectedDate));
            }
          }}
        />
      )}

      {dueDatePickerOpen && (
        <DateTimePicker
          value={new Date(dueDate)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setDueDatePickerOpen(false);
            if (selectedDate) {
              setDueDate(formatDateForInput(selectedDate));
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
