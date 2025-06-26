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
    <View className="flex-row items-center justify-between px-4 py-3 bg-primary">
      <TouchableOpacity onPress={onPrevMonth} className="px-3 py-1">
        <Text className="text-2xl text-yellow-500">&lt;</Text>
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-white">
        {viewMode === "days"
          ? formatMonthYear(currentMonth, currentYear.toString())
          : currentYear.toString()}
      </Text>
      <TouchableOpacity onPress={onNextMonth} className="px-3 py-1">
        <Text className="text-2xl text-yellow-500">&gt;</Text>
      </TouchableOpacity>
    </View>
  );
};
