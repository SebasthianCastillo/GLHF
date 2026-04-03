import React, { useState, useEffect } from "react";
import CustomField from "@/components/Field";
import CustomButton from "@/components/Button";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import LoadingIndicator from "@/components/LoadingIndicator";

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (productName: string, quantity: number) => void;
  isPending: boolean;
  successMessage: string;
}

export default function AddProductModal({
  visible,
  onClose,
  onAdd,
  isPending,
  successMessage,
}: AddProductModalProps) {
  const [productName, setProductName] = useState("");
  const [quantityProduct, setQuantityProduct] = useState(0);
  const [localSuccessMessage, setLocalSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      setLocalSuccessMessage(successMessage);
      const timer = setTimeout(() => {
        setLocalSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAdd = () => {
    if (!productName.trim()) return;
    onAdd(productName, quantityProduct);
    setProductName("");
    setQuantityProduct(0);
  };

  const handleClose = () => {
    setProductName("");
    setQuantityProduct(0);
    setLocalSuccessMessage("");
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} className="z-50 bg-black/50 justify-center items-center">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="w-full h-full justify-center items-center"
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className="bg-neutral-800 p-6 rounded-xl mx-8 w-80">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-bold">
                Agregar Producto
              </Text>
              <TouchableOpacity onPress={handleClose} className="p-2">
                <FontAwesome6 name="times" size={20} color="#737373" />
              </TouchableOpacity>
            </View>

            <CustomField
              title="Nombre Producto"
              value={productName}
              onChangeText={setProductName}
              otherStyles="mb-4"
              placeholder="Nombre Producto"
            />

            <View className="flex justify-center items-center p-2">
              {localSuccessMessage ? (
                <Text className="text-green-600 font-extrabold text-sm">
                  {localSuccessMessage}
                </Text>
              ) : (
                <Text className="">{}</Text>
              )}
            </View>

            {isPending ? (
              <View className="py-3">
                <LoadingIndicator />
              </View>
            ) : (
              <CustomButton
                containerStyles="w-full"
                text="Agregar"
                HandlePress={handleAdd}
                size="text-base"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}