import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import LoadingIndicator from "@/components/LoadingIndicator";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  const [localSuccessMessage, setLocalSuccessMessage] = useState("");
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

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
    onAdd(productName, 0);
    setProductName("");
  };

  const handleClose = () => {
    setProductName("");
    setLocalSuccessMessage("");
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} className="z-50">
      <Animated.View 
        className="absolute inset-0 bg-black/60"
        style={{ opacity: backdropOpacity }}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className="flex-1" />
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View
        className="absolute bottom-0 left-0 right-0"
        style={{ transform: [{ translateY: slideAnim }] }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full"
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-neutral-900 rounded-t-[28px] px-6 pb-8 pt-4 shadow-2xl border-t border-white/10">
              {/* Drag Indicator */}
              <View className="items-center mb-6">
                <View className="w-12 h-1.5 bg-neutral-700 rounded-full" />
              </View>

              {/* Header */}
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-2xl font-bold tracking-tight">
                  Nuevo Producto
                </Text>
                <TouchableOpacity 
                  onPress={handleClose} 
                  className="w-10 h-10 rounded-full bg-neutral-800 justify-center items-center"
                >
                  <FontAwesome6 name="xmark" size={16} color="#A3A3A3" />
                </TouchableOpacity>
              </View>

              {/* Product Name Input */}
              <View className="mb-6">
                <Text className="text-neutral-400 text-sm font-medium mb-2 ml-1">
                  Nombre del producto
                </Text>
                <View className="bg-neutral-800/50 rounded-2xl border border-neutral-700/50">
                  <TextInput
                    className="text-white text-lg px-4 py-4 font-medium"
                    value={productName}
                    onChangeText={setProductName}
                    placeholder="Ej: Harina, Azúcar, etc."
                    placeholderTextColor="#525252"
                    autoCapitalize="words"
                    autoFocus
                  />
                </View>
              </View>

              {/* Success Message */}
              {localSuccessMessage && (
                <View className="mb-4 py-3 px-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <Text className="text-green-400 text-center font-medium">
                    {localSuccessMessage}
                  </Text>
                </View>
              )}

              {/* Add Button */}
              {isPending ? (
                <View className="py-4">
                  <LoadingIndicator />
                </View>
              ) : (
                <TouchableOpacity
                  className={`py-4 rounded-2xl items-center ${
                    productName.trim() 
                      ? "bg-amber-500 shadow-lg shadow-amber-500/30" 
                      : "bg-neutral-700"
                  }`}
                  onPress={handleAdd}
                  disabled={!productName.trim()}
                  activeOpacity={0.8}
                >
                  <Text className={`text-lg font-semibold ${
                    productName.trim() ? "text-white" : "text-neutral-400"
                  }`}>
                    Agregar Producto
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}