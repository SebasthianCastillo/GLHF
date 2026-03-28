import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Expense } from "../app/api/expenses";

interface PayExpenseModalProps {
  visible: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSuccess: () => void;
  onPay: (amount: number) => Promise<void>;
  isLoading: boolean;
}

const formatAmount = (amount: number) => {
  return `$${amount.toLocaleString("es-ES", { minimumFractionDigits: 0 })}`;
};

export default function PayExpenseModal({
  visible,
  expense,
  onClose,
  onSuccess,
  onPay,
  isLoading,
}: PayExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible && expense) {
      setAmount(expense.amount.toString());
    }
  }, [visible, expense]);

  if (!visible || !expense) return null;

  const handlePay = async () => {
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Ingresa un monto válido");
      return;
    }

    setError("");
    
    try {
      await onPay(parsedAmount);
      setAmount("");
      onSuccess();
    } catch (err) {
      setError("Error al registrar el pago");
    }
  };

  const handleClose = () => {
    setAmount("");
    setError("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.backdrop} 
            onPress={handleClose}
          />
          <View style={styles.container}>
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-6">
              <View className="w-10 h-10 rounded-full bg-green-600/20 items-center justify-center">
                <Ionicons name="wallet" size={22} color="#2ba640" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Pagar Gasto</Text>
                <Text className="text-gray-500 text-xs">Registra tu pago</Text>
              </View>
              <TouchableOpacity onPress={handleClose} className="p-2">
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Category & Date Info */}
            <View className="bg-[#1a1a1a] p-4 mb-3">
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="pricetag-outline" size={14} color="#F59E0B" />
                <Text className="text-gray-400 text-xs">Categoría</Text>
              </View>
              <Text className="text-white font-medium text-base">
                {expense.categoryName || "Sin categoría"}
              </Text>
            </View>

            {/* Amount to Pay - Highlighted */}
            <View className="border border-green-600/30 bg-green-600/5 p-4 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="cash" size={18} color="#2ba640" />
                  <Text className="text-gray-300 text-sm">Monto a pagar</Text>
                </View>
                <Text className="text-amber-500 text-xs">Total pendiente</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-white text-3xl font-bold">
                  {formatAmount(expense.amount)}
                </Text>
              </View>
            </View>

            {/* Input Field */}
            <View className="mb-2">
              <Text className="text-gray-400 text-xs mb-2">Ingresa el monto</Text>
              <View className="flex-row items-center bg-[#1a1a1a] border border-[#333] px-4 py-3">
                <Text className="text-gray-400 text-xl">$</Text>
                <TextInput
                  className="text-white text-xl flex-1 ml-2"
                  placeholder="0"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  editable={!isLoading}
                />
                <Ionicons name="create-outline" size={18} color="#555" />
              </View>
              {error ? (
                <View className="flex-row items-center gap-1 mt-2">
                  <Ionicons name="alert-circle" size={14} color="#ef4444" />
                  <Text className="text-red-400 text-xs">{error}</Text>
                </View>
              ) : null}
            </View>

            {/* Quick Amount Buttons */}
            <View className="flex-row gap-2 mb-5">
              <TouchableOpacity 
                onPress={() => setAmount((expense.amount * 0.25).toString())}
                className="flex-1 bg-[#1a1a1a] py-2 border border-[#333]"
              >
                <Text className="text-gray-400 text-xs text-center">25%</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setAmount((expense.amount * 0.5).toString())}
                className="flex-1 bg-[#1a1a1a] py-2 border border-[#333]"
              >
                <Text className="text-gray-400 text-xs text-center">50%</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setAmount(expense.amount.toString())}
                className="flex-1 bg-[#1a1a1a] py-2 border border-[#333]"
              >
                <Text className="text-gray-400 text-xs text-center">100%</Text>
              </TouchableOpacity>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={handlePay}
              disabled={isLoading || !amount}
              className={`py-3.5 flex-row items-center justify-center gap-2 ${
                isLoading || !amount ? "bg-[#333]" : "bg-green-600"
              }`}
              style={isLoading || !amount ? {} : { shadowColor: '#2ba640', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-done" size={20} color="white" />
                  <Text className="text-white font-semibold text-base">
                    Confirmar Pago
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  container: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 20,
    width: 350,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
});
