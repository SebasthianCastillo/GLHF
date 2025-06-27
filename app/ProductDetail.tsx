import { useLocalSearchParams, router } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  axios,
  Constants,
  useFocusEffect,
  React,
  FontAwesome6,
} from "./lib/shared"; // Centralized imports
import { MonthSelector } from "@/components/ProductDetail/MonthSelector";
import { TransactionDayItem } from "@/components/ProductDetail/TransactionDayItem";
const API_URL =
  Constants.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

interface ProductDetail {
  _id: string;
  quantity: number;
  date: Date;
  format: string;
  operation: string;
  ProductID: string;
}

const ProductDetail = () => {
  const { product } = useLocalSearchParams();
  const [filteredDetails, setFilteredDetails] = useState<ProductDetail[]>([]);
  const [dailySummaries, setDailySummaries] = useState<
    Array<{
      date: string;
      dateObj: Date;
      added: number;
      removed: number;
      transactions: ProductDetail[];
    }>
  >([]);
  const [ProductDetailSummaryAdd, setProductDetailSummaryAdd] =
    useState<number>(0);
  const [ProductDetailSummaryMinus, setProductDetailSummaryMinus] =
    useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"days" | "months">("days");
  const [monthlySummaries, setMonthlySummaries] = useState<
    Array<{
      month: number;
      year: number;
      added: number;
      removed: number;
      transactions: ProductDetail[];
    }>
  >([]);

  const productObject = Array.isArray(product)
    ? JSON.parse(product[0])
    : JSON.parse(product || "{}");
  // #region Functions
  // carga lista de historial de productos
  useFocusEffect(
    useCallback(() => {
      const productDetailFunction = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/productDetailByIDProduct`,
            {
              params: { ProductKey: productObject._id },
            }
          );

          filterByMonth(response.data, currentMonth, currentYear); // Filter data initially
        } catch (error) {
          console.log(
            "error fetching products detail by id data or month dosent have products",
            error
          );
          setProductDetailSummaryAdd(0);
          setProductDetailSummaryMinus(0);
        }
      };

      productDetailFunction();
    }, [currentMonth, currentYear])
  );

  // Cuenta cuantos productos fueron agregados y quitados por mes
  const fetchSummaryData = async (currentMonth: Date) => {
    try {
      const addResponse = await axios.get(
        `${API_URL}/productDetailSummaryByOperationAdd`,
        {
          params: {
            ProductKey: productObject._id,
            currentMonth: currentMonth,
          },
        }
      );

      const minusResponse = await axios.get(
        `${API_URL}/productDetailSummaryByOperationMinus`,
        {
          params: {
            ProductKey: productObject._id,
            currentMonth: currentMonth,
          },
        }
      );

      if (Array.isArray(addResponse.data) && addResponse.data.length > 0) {
        setProductDetailSummaryAdd(addResponse.data[0].totalQuantity);
      } else {
        setProductDetailSummaryAdd(0); // Establece un valor predeterminado si el array está vacío
      }

      if (Array.isArray(minusResponse.data) && minusResponse.data.length > 0) {
        setProductDetailSummaryMinus(minusResponse.data[0].totalQuantity);
      } else {
        setProductDetailSummaryMinus(0); // Establece un valor predeterminado si el array está vacío
      }
    } catch (error) {
      console.log("error fetching products detail summary data", error);
    }
  };

  // Function to group transactions by month and calculate monthly summaries
  const groupTransactionsByMonth = (transactions: ProductDetail[]) => {
    const groups: Record<
      string,
      {
        month: number;
        year: number;
        added: number;
        removed: number;
        transactions: ProductDetail[];
      }
    > = {};

    transactions.forEach((item) => {
      const date = new Date(item.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthKey = `${year}-${month}`;

      if (!groups[monthKey]) {
        groups[monthKey] = {
          month,
          year,
          added: 0,
          removed: 0,
          transactions: [],
        };
      }

      if (item.operation === "add") {
        groups[monthKey].added += item.quantity;
      } else {
        groups[monthKey].removed += item.quantity;
      }

      groups[monthKey].transactions.push(item);
    });

    return Object.values(groups).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  };

  // Function to group transactions by day and calculate daily summaries
  const groupTransactionsByDay = (transactions: ProductDetail[]) => {
    const groups: Record<
      string,
      {
        date: string;
        dateObj: Date;
        added: number;
        removed: number;
        transactions: ProductDetail[];
      }
    > = {};

    transactions.forEach((item) => {
      const date = new Date(item.date);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          dateObj: date,
          added: 0,
          removed: 0,
          transactions: [],
        };
      }

      if (item.operation === "add") {
        groups[dateKey].added += item.quantity;
      } else {
        groups[dateKey].removed += item.quantity;
      }
      groups[dateKey].transactions.push(item);
    });

    return Object.values(groups).sort(
      (a, b) => b.dateObj.getTime() - a.dateObj.getTime()
    );
  };

  const toggleDayExpanded = (date: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "days" ? "months" : "days"));
  };

  // Funcion que filtra la data por mes
  const filterByMonth = (
    data: ProductDetail[],
    month: number,
    year: number
  ) => {
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === month && itemDate.getFullYear() === year;
    });

    setFilteredDetails(filtered);
    const daily = groupTransactionsByDay(filtered);
    const monthly = groupTransactionsByMonth(filtered);
    setDailySummaries(daily);
    setMonthlySummaries(monthly);

    // Calculate monthly totals
    if (filtered.length > 0) {
      fetchSummaryData(new Date(year, month, 1));
    } else {
      setProductDetailSummaryAdd(0);
      setProductDetailSummaryMinus(0);
    }
  };

  // setea cambio de mes en vista producto detail
  const handlePrevMonth = () => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(prevMonth);
    setCurrentYear(prevYear);
  };

  // setea cambio de mes en vista producto detail
  const handleNextMonth = () => {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };

  const formatMonthYear = (month: number, year?: string) => {
    const months = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];
    return `${months[month]} ${year}`;
  };

  const renderMonthItem = ({
    item,
  }: {
    item: (typeof monthlySummaries)[0];
  }) => {
    const isCurrentMonth =
      item.month === new Date().getMonth() &&
      item.year === new Date().getFullYear();

    return (
      <View className="mb-2">
        <View className="flex-row justify-between items-center bg-gray-700 p-4 rounded-lg">
          <View className="flex-row items-center">
            <Text className="text-white text-base font-bold">
              {formatMonthYear(item.month, "")}
            </Text>
            {isCurrentMonth && (
              <Text className="ml-2 px-2 py-0.5 bg-yellow-500 text-xs text-white rounded-full">
                Actual
              </Text>
            )}
          </View>
          <View className="flex-row items-center space-x-20">
            <Text className="text-emerald-400 font-bold text-xl">
              {item.added}
            </Text>
            <Text className="text-red-400 font-bold text-xl">
              {item.removed}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDayItem = ({ item }: { item: (typeof dailySummaries)[0] }) => (
    <TransactionDayItem
      item={{
        ...item,
        transactions: item.transactions.map((t) => ({
          ...t,
          date: t.date instanceof Date ? t.date.toISOString() : t.date,
        })),
      }}
      isExpanded={!!expandedDays[item.date]}
      onToggleExpand={toggleDayExpanded}
    />
  );

  const renderEmptyComponent = () => (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-gray-400 text-lg">No hay movimientos este mes</Text>
    </View>
  );
  // #endregion
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row items-center justify-between p-4 bg-primary">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <FontAwesome6 name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">
            {productObject.Name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleViewMode}
          className="px-3 py-2 bg-slate-700 rounded-lg"
        >
          <Text className="text-white font-medium">
            {viewMode === "days" ? "Por Mes" : "Por Días"}
          </Text>
        </TouchableOpacity>
      </View>

      <MonthSelector
        currentMonth={currentMonth}
        currentYear={currentYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        formatMonthYear={formatMonthYear}
      />
      <View className="flex-1 px-2 py-2">
        <View className="flex-row justify-between items-center mb-2"></View>
        {viewMode === "days" ? (
          <FlatList
            data={dailySummaries}
            renderItem={renderDayItem}
            keyExtractor={(item) => item.date}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={monthlySummaries}
            renderItem={renderMonthItem}
            keyExtractor={(item) => `${item.year}-${item.month}`}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <View className="flex-row justify-between mt-4">
        <View className="h-16 w-32">
          <View className="flex-1 items-center justify-center bg-emerald-600 rounded-lg shadow-lg p-4">
            <Text className="text-3xl font-bold text-white">
              {ProductDetailSummaryAdd}
            </Text>
          </View>
        </View>
        {/* <View className="h-24 w-32">
          <View className="flex-1 items-center justify-center bg-yellow-500 rounded-lg shadow-lg p-4">
            <Text className="text-3xl font-bold text-white pt-5">
              {ProductDetailSummaryAdd - ProductDetailSummaryMinus}
            </Text>
            <Text className="text-center pt-1 ">Disponible</Text>
          </View>
        </View> */}
        <View className="h-16 w-32">
          <View className="flex-1 items-center justify-center bg-red-500 rounded-lg shadow-lg p-4">
            <Text className="text-3xl font-bold text-white">
              {ProductDetailSummaryMinus}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetail;
