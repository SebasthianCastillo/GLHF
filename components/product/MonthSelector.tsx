import { View, Text, TouchableOpacity } from "react-native";

type MonthSelectorProps = {
  currentMonth: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  formatMonthYear: (month: number, year: string) => string;
};

export const MonthSelector = ({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  formatMonthYear,
}: MonthSelectorProps) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-primary">
      <TouchableOpacity onPress={onPrevMonth} className="px-3 py-1">
        <Text className="text-2xl text-yellow-500">&lt;</Text>
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-white">
        {formatMonthYear(currentMonth, currentYear.toString())}
      </Text>
      <TouchableOpacity onPress={onNextMonth} className="px-3 py-1">
        <Text className="text-2xl text-yellow-500">&gt;</Text>
      </TouchableOpacity>
    </View>
  );
};
