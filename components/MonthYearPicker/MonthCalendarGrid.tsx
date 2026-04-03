import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { useMonthSelectionStore } from "../../store/useMonthSelectionStore";
import { FontAwesome5 } from "@expo/vector-icons";

const MONTHS = [
  { label: "ENE", short: "ENE", value: 0 },
  { label: "FEBRERO", short: "FEB", value: 1 },
  { label: "MARZO", short: "MAR", value: 2 },
  { label: "ABRIL", short: "ABR", value: 3 },
  { label: "MAYO", short: "MAY", value: 4 },
  { label: "JUNIO", short: "JUN", value: 5 },
  { label: "JULIO", short: "JUL", value: 6 },
  { label: "AGOSTO", short: "AGO", value: 7 },
  { label: "SEPTIEMBRE", short: "SEP", value: 8 },
  { label: "OCTUBRE", short: "OCT", value: 9 },
  { label: "NOVIEMBRE", short: "NOV", value: 10 },
  { label: "DICIEMBRE", short: "DIC", value: 11 },
];

interface MonthCalendarGridProps {
  onClose?: () => void;
}

const MonthCalendarGrid: React.FC<MonthCalendarGridProps> = ({ onClose }) => {
  const { 
    currentYear, 
    setCurrentYear, 
    toggleMonth, 
    isSelected, 
    selectedMonths,
    selectAll,
    clearSelection 
  } = useMonthSelectionStore();

  const selectedCount = selectedMonths.length;
  const allSelected = selectedCount === 12;

  return (
    <View className="flex-1">
      {/* Year Selector */}
      <View className="flex-row justify-between items-center py-4 px-2">
        <TouchableOpacity 
          onPress={() => setCurrentYear(currentYear - 1)}
          className="p-3"
        >
          <FontAwesome5 name="chevron-left" size={18} color="#ff9500" />
        </TouchableOpacity>
        
        <Text className="text-white text-[20px] font-semibold">
          {currentYear}
        </Text>
        
        <TouchableOpacity 
          onPress={() => setCurrentYear(currentYear + 1)}
          className="p-3"
        >
          <FontAwesome5 name="chevron-right" size={18} color="#ff9500" />
        </TouchableOpacity>
      </View>

      {/* Months Grid - 2 rows of 6 */}
      <View className="flex-row flex-wrap justify-between px-1">
        {MONTHS.map((month) => {
          const isMonthSelected = isSelected(month.value, currentYear);
          
          return (
            <TouchableOpacity
              key={month.value}
              onPress={() => toggleMonth(month.value, currentYear)}
              className="w-[30%] mb-2"
            >
              <View 
                className={`h-[56px] rounded-[12px] justify-center items-center border ${
                  isMonthSelected 
                    ? "bg-[#ff9500]/20 border-[#ff9500]" 
                    : "bg-[#2c2c2e] border-[#38383a]"
                }`}
              >
                <Text 
                  className={`text-[15px] font-medium ${
                    isMonthSelected ? "text-[#ff9500]" : "text-white"
                  }`}
                >
                  {month.short}
                </Text>
                
                {isMonthSelected && (
                  <View className="absolute top-1.5 right-1.5">
                    <FontAwesome5 name="check-circle" size={12} color="#ff9500" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selection Info & Actions */}
      <View className="mt-4 pt-4 border-t border-[#38383a] px-2">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View 
              className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                allSelected 
                  ? "bg-[#ff9500] border-[#ff9500]" 
                  : selectedCount > 0
                  ? "border-[#ff9500]"
                  : "border-[#636366]"
              }`}
            >
              {(allSelected || selectedCount > 0) && (
                <FontAwesome5 name="check" size={10} color="#000" />
              )}
            </View>
            <Text className="text-white text-[15px]">
              {selectedCount > 0 
                ? `${selectedCount} mes${selectedCount > 1 ? 'es' : ''} seleccionado${selectedCount > 1 ? 's' : ''}`
                : 'Seleccionar meses'
              }
            </Text>
          </View>
          
          {selectedCount > 0 && (
            <TouchableOpacity 
              onPress={clearSelection}
              className="px-3 py-1.5"
            >
              <Text className="text-[#ff3b30] text-[14px]">Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default MonthCalendarGrid;
