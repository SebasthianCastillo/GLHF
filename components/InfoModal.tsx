import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from "react-native";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export default function InfoModal({
  visible,
  onClose,
  title,
  message,
  buttonText = "Entendido",
}: InfoModalProps) {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} className="z-50 bg-black/50 justify-center items-center">
      <TouchableWithoutFeedback>
        <View className="bg-neutral-800 p-6 rounded-xl mx-8 w-80">
          <Text className="text-white text-lg font-semibold mb-3 text-center">
            {title}
          </Text>
          <Text className="text-gray-300 text-sm text-center leading-5">
            {message}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="mt-5 bg-amber-500 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
