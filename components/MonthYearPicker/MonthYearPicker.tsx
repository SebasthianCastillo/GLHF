import { useCallback, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import MonthCalendarGrid from "./MonthCalendarGrid";
import { useMonthSelectionStore } from "../../store/useMonthSelectionStore";
import { FontAwesome5 } from "@expo/vector-icons";

export interface MonthYearPickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const { selectedMonths, clearSelection } = useMonthSelectionStore();

  useEffect(() => {
    if (visible) {
      // Limpiar selección al abrir
      clearSelection();
    }
  }, [visible, clearSelection]);

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    clearSelection();
    onClose();
  }, [clearSelection, onClose]);

  const selectedCount = selectedMonths.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 justify-end">
        {/* Background overlay */}
        <Pressable 
          className="absolute inset-0 bg-black/50" 
          onPress={handleCancel}
        />
        
        {/* Picker Card - iOS style */}
        <View className="bg-[#1c1c1e] rounded-t-[14px] overflow-hidden">
          {/* Header */}
          <View className="flex-row justify-between items-center h-[44px] px-4 border-b border-[#38383a]">
            <TouchableOpacity onPress={handleCancel} className="py-1">
              <Text className="text-[#ff9500] text-[17px]">Cancelar</Text>
            </TouchableOpacity>
            <Text className="text-white text-[17px] font-semibold">
              Seleccionar meses
            </Text>
            <TouchableOpacity 
              onPress={handleConfirm} 
              className="py-1"
              disabled={selectedCount === 0}
            >
              <Text 
                className={`text-[17px] font-semibold ${
                  selectedCount > 0 ? "text-[#ff9500]" : "text-[#636366]"
                }`}
              >
                Aceptar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View className="px-2 pb-4">
            <MonthCalendarGrid />
          </View>

          {/* Safe Area Spacer */}
          <View className="h-[34px] bg-[#1c1c1e]" />
        </View>
      </View>
    </Modal>
  );
};

export default MonthYearPicker;
