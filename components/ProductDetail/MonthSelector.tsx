import { View, Text, TouchableOpacity } from "react-native";

type MonthSelectorProps = {
  currentMonth: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  formatMonthYear: (month: number, year: string) => string;
  viewMode?: "days" | "months";
};

export const MonthSelector = ({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  formatMonthYear,
  viewMode = "days",
}: MonthSelectorProps) => {
  return (
    <View className="flex-row items-center justify-between px-2 py-3 bg-[#272727] rounded-xl">
      <TouchableOpacity 
        onPress={onPrevMonth} 
        className="w-10 h-10 items-center justify-center"
      >
        <Text className="text-[#F59E0B] text-3xl font-medium">‹</Text>
      </TouchableOpacity>
      <Text className="text-base font-semibold text-white">
        {viewMode === "days"
          ? formatMonthYear(currentMonth, currentYear.toString())
          : currentYear.toString()}
      </Text>
      <TouchableOpacity 
        onPress={onNextMonth} 
        className="w-10 h-10 items-center justify-center"
      >
        <Text className="text-[#F59E0B] text-3xl font-medium">›</Text>
      </TouchableOpacity>
    </View>
  );
};
