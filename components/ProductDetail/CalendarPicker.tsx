import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  formatMonthYear,
  getPreviousMonth,
  getNextMonth,
} from "../../app/api/productDetail";

interface CalendarPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  currentMonth: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onDateSelect,
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
}) => {
  const today = useMemo(() => {
    const now = new Date();
    return {
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    };
  }, []);

  const daysInMonth = useMemo(() => {
    const days: (number | null)[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysCount; i++) {
      days.push(i);
    }

    return days;
  }, [currentMonth, currentYear]);

  const isSelected = (day: number) =>
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentMonth &&
    selectedDate.getFullYear() === currentYear;

  const isToday = (day: number) =>
    today.day === day &&
    today.month === currentMonth &&
    today.year === currentYear;

  const handleDayPress = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateSelect(newDate);
  };

  const handlePrevMonth = () => {
    const { month, year } = getPreviousMonth(currentMonth, currentYear);
    onPrevMonth();
  };

  const handleNextMonth = () => {
    const { month, year } = getNextMonth(currentMonth, currentYear);
    onNextMonth();
  };

  return (
    <View className="bg-[#1a1a1a] p-2 rounded-lg">
      <View className="flex-row items-center justify-between mb-2">
        <TouchableOpacity
          onPress={handlePrevMonth}
          className="p-1.5 rounded-lg bg-[#272727]"
        >
          <Text className="text-white text-base font-bold">‹</Text>
        </TouchableOpacity>

        <Text className="text-white text-sm font-semibold">
          {formatMonthYear(currentMonth, String(currentYear))}
        </Text>

        <TouchableOpacity
          onPress={handleNextMonth}
          className="p-1.5 rounded-lg bg-[#272727]"
        >
          <Text className="text-white text-base font-bold">›</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-1">
        {WEEKDAYS.map((day) => (
          <View key={day} className="flex-1 items-center py-1">
            <Text className="text-[#777] text-[10px] font-medium">{day}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {daysInMonth.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} className="w-[14.28%] aspect-square" />;
          }

          const selected = isSelected(day);
          const todayDate = isToday(day);

          return (
            <TouchableOpacity
              key={day}
              onPress={() => handleDayPress(day)}
              className="w-[14.28%] aspect-square items-center justify-center"
            >
              <View
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  selected
                    ? "bg-[#F59E0B]"
                    : todayDate
                    ? "bg-transparent border border-[#F59E0B]"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    selected ? "text-black" : "text-white"
                  }`}
                >
                  {day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CalendarPicker;
