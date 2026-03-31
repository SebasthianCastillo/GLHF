import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import {
  MONTH_YEAR_PICKER_CONFIG,
  getMonthYearPickerRange,
} from "../../constants/monthYearPicker";

export interface MonthYearPickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (month: number, year: number) => void;
  initialMonth: number;
  initialYear: number;
  minYear?: number;
  maxYear?: number;
  yearsBack?: number;
  yearsForward?: number;
}

const MONTHS = [
  { label: "Enero", value: 0 },
  { label: "Febrero", value: 1 },
  { label: "Marzo", value: 2 },
  { label: "Abril", value: 3 },
  { label: "Mayo", value: 4 },
  { label: "Junio", value: 5 },
  { label: "Julio", value: 6 },
  { label: "Agosto", value: 7 },
  { label: "Septiembre", value: 8 },
  { label: "Octubre", value: 9 },
  { label: "Noviembre", value: 10 },
  { label: "Diciembre", value: 11 },
];

const generateYears = (minYear: number, maxYear: number): number[] => {
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }
  return years;
};

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialMonth,
  initialYear,
  minYear,
  maxYear,
  yearsBack = MONTH_YEAR_PICKER_CONFIG.yearsBack,
  yearsForward = MONTH_YEAR_PICKER_CONFIG.yearsForward,
}) => {
  const configRange = getMonthYearPickerRange({ yearsBack, yearsForward });
  const safeMinYear = minYear ?? configRange.minYear;
  const safeMaxYear = maxYear ?? configRange.maxYear;

  const yearsList = useMemo(
    () => generateYears(safeMinYear, safeMaxYear),
    [safeMinYear, safeMaxYear]
  );

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  useEffect(() => {
    if (visible) {
      setSelectedMonth(initialMonth);
      setSelectedYear(initialYear);
    }
  }, [visible, initialMonth, initialYear]);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedMonth, selectedYear);
  }, [onConfirm, selectedMonth, selectedYear]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleBackdropPress = useCallback(() => {
    handleCancel();
  }, [handleCancel]);

  if (!visible) return null;

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
          onPress={handleBackdropPress}
        />
        
        {/* Picker Card */}
        <View className="bg-[#2c2c2e] rounded-t-[14px] overflow-hidden">
          {/* Header */}
          <View className="flex-row justify-between items-center h-[44px] px-4 border-b border-[#38383a]">
            <TouchableOpacity onPress={handleCancel} className="py-1">
              <Text className="text-[#ff9500] text-[17px]">Cancelar</Text>
            </TouchableOpacity>
            <Text className="text-white text-[17px] font-semibold">
              Seleccionar fecha
            </Text>
            <TouchableOpacity onPress={handleConfirm} className="py-1">
              <Text className="text-[#ff9500] text-[17px] font-semibold">Aceptar</Text>
            </TouchableOpacity>
          </View>

          {/* Picker Content */}
          <View className="flex-row h-[252px]">
            {/* Months Column */}
            <View className="flex-1">
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 108 }}
                bounces={false}
              >
                {MONTHS.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    onPress={() => setSelectedMonth(month.value)}
                    className="h-[36px] justify-center items-center"
                  >
                    <Text
                      className={`text-[22px] ${
                        selectedMonth === month.value
                          ? "text-white font-normal"
                          : "text-[#636366]"
                      }`}
                    >
                      {month.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Divider */}
            <View className="w-px bg-[#38383a]" />

            {/* Years Column */}
            <View className="flex-1">
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 108 }}
                bounces={false}
              >
                {yearsList.map((year) => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => setSelectedYear(year)}
                    className="h-[36px] justify-center items-center"
                  >
                    <Text
                      className={`text-[22px] ${
                        selectedYear === year
                          ? "text-white font-normal"
                          : "text-[#636366]"
                      }`}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Safe Area Spacer */}
        <View className="h-[34px] bg-[#2c2c2e]" />
      </View>
    </Modal>
  );
};

export default MonthYearPicker;
