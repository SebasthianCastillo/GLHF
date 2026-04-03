import { View, Text, TouchableOpacity } from "react-native";
import { useMonthSelectionStore } from "../../store/useMonthSelectionStore";
import { FontAwesome5 } from "@expo/vector-icons";

const MONTHS = [
  { label: "ENE", short: "ENE", value: 0 },
  { label: "FEB", short: "FEB", value: 1 },
  { label: "MAR", short: "MAR", value: 2 },
  { label: "ABR", short: "ABR", value: 3 },
  { label: "MAY", short: "MAY", value: 4 },
  { label: "JUN", short: "JUN", value: 5 },
  { label: "JUL", short: "JUL", value: 6 },
  { label: "AGO", short: "AGO", value: 7 },
  { label: "SEP", short: "SEP", value: 8 },
  { label: "OCT", short: "OCT", value: 9 },
  { label: "NOV", short: "NOV", value: 10 },
  { label: "DIC", short: "DIC", value: 11 },
];

const MonthCalendarInline: React.FC = () => {
  const { 
    currentYear, 
    setCurrentYear, 
    toggleMonth, 
    isSelected, 
    selectedMonths,
    clearSelection 
  } = useMonthSelectionStore();

  const selectedCount = selectedMonths.length;

  return (
    <View className="bg-[#1c1c1e] rounded-b-[12px] border border-t-0 border-[#38383a] px-2 pb-3">
      {/* Year Selector */}
      <View className="flex-row justify-between items-center py-3">
        <TouchableOpacity 
          onPress={() => setCurrentYear(currentYear - 1)}
          className="p-2"
        >
          <FontAwesome5 name="chevron-left" size={16} color="#ff9500" />
        </TouchableOpacity>
        
        <Text className="text-white text-[17px] font-semibold">
          {currentYear}
        </Text>
        
        <TouchableOpacity 
          onPress={() => setCurrentYear(currentYear + 1)}
          className="p-2"
        >
          <FontAwesome5 name="chevron-right" size={16} color="#ff9500" />
        </TouchableOpacity>
      </View>

      {/* Months Grid - 2 rows of 6 */}
      <View className="flex-row flex-wrap justify-between">
        {MONTHS.map((month) => {
          const isMonthSelected = isSelected(month.value, currentYear);
          
          return (
            <TouchableOpacity
              key={month.value}
              onPress={() => toggleMonth(month.value, currentYear)}
              className="w-[30%] mb-2"
            >
              <View 
                className={`h-[48px] rounded-[10px] justify-center items-center border ${
                  isMonthSelected 
                    ? "bg-[#ff9500]/20 border-[#ff9500]" 
                    : "bg-[#2c2c2e] border-[#38383a]"
                }`}
              >
                <Text 
                  className={`text-[14px] font-medium ${
                    isMonthSelected ? "text-[#ff9500]" : "text-white"
                  }`}
                >
                  {month.short}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selection Info */}
      <View className="flex-row justify-between items-center pt-2 border-t border-[#38383a]">
        <Text className="text-[#8e8e93] text-[13px]">
          {selectedCount > 0 
            ? `${selectedCount} mes${selectedCount > 1 ? 'es' : ''} selected`
            : 'Tap months to select'
          }
        </Text>
        
        {selectedCount > 0 && (
          <TouchableOpacity 
            onPress={clearSelection}
            className="px-2 py-1"
          >
            <Text className="text-[#ff3b30] text-[13px]">Clear</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MonthCalendarInline;
