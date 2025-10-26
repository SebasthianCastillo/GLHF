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
import SummarySquare from "@/components/ProductDetail/SummarySquare";
import { useSummaryStore } from "@/store/useSummaryStore";
import { AggregationResult } from "./lib/types";
import RouterBackArrow from "@/components/RouterBackArrow";
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
  const {
    productDetailSummaryAdd: ProductDetailSummaryAdd,
    setProductDetailSummaryAdd,
    productDetailSummaryMinus: ProductDetailSummaryMinus,
    setProductDetailSummaryMinus,
  } = useSummaryStore();
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"days" | "months">("days");
  const [monthlySummaries, setMonthlySummaries] = useState<AggregationResult>({
    years: [],
    dataByYear: {},
  });

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
  const getMonthlySummaries = async () => {
    try {
      const response = await axios.get(`${API_URL}/getMonthlySummaries`, {
        params: { ProductKey: productObject._id },
      });
      // const dataTranform = transformedData(response.data);

      setMonthlySummaries(response.data);

      // // Sort years in descending order
      // groupedByYear.years.sort((a, b) => b - a);

      // // Sort months within each year in descending order
      // Object.values(groupedByYear.dataByYear).forEach((months) => {
      //   months.sort((a, b) => b.month - a.month);
      // });

      // setMonthlyData(groupedByYear);
    } catch (error) {
      console.log("error fetching monthly summaries data", error);
    }
  };
  // const transformedData = (response: AggregationResult) => {
  //   return response.years.flatMap((year) => {
  //     const monthsArray = response.dataByYear[year];
  //     return monthsArray.map((item) => ({
  //       month: item.month - 1,
  //       year: item.year,
  //       added: item.added,
  //       removed: item.removed,
  //       monthName: item.monthName,
  //     }));
  //   });
  // };

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

  const toggleViewMode = useCallback(() => {
    if (viewMode === "days") {
      getMonthlySummaries();
    }
    setViewMode((prev) => (prev === "days" ? "months" : "days"));
  }, [viewMode]);

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
    // const monthly = groupTransactionsByMonth(filtered);
    setDailySummaries(daily);
    // setMonthlySummaries(monthly);

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
    item: {
      month: number;
      year: number;
      added: number;
      removed: number;
      monthName: string;
    };
  }) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthKey = `${monthNames[item.month - 1]}`;
    const today = new Date();
    const monthIndex = today.getMonth();
    const isMonth =
      item.month - 1 === monthIndex && item.year === today.getFullYear();
    return (
      <View className="mb-2">
        <View className="flex-row justify-between items-center bg-gray-700 p-3 pl-4 rounded-lg">
          <View className="flex-row items-center">
            <View>
              <Text className="text-white text-lg font-bold">{monthKey}</Text>
            </View>
            {isMonth && (
              <Text className="ml-2 px-2 py-0.5 bg-yellow-500 text-xs text-white rounded-full">
                Actual
              </Text>
            )}
          </View>
          <View className="flex-row items-center space-x-6">
            <View className="items-center">
              <Text className="text-emerald-400 font-bold text-xl">
                {item.added}
              </Text>
              <Text className="text-gray-400 text-xs">Agregados</Text>
            </View>
            <View className="items-center">
              <Text className="text-red-400 font-bold text-xl">
                {item.removed}
              </Text>
              <Text className="text-gray-400 text-xs">Retirados</Text>
            </View>
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
      <Text className="text-gray-400 text-lg">
        {viewMode === "days"
          ? "No hay movimientos este mes"
          : "No hay datos mensuales disponibles"}
      </Text>
    </View>
  );
  // #endregion
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row items-center justify-between p-4 bg-primary">
        <View className="flex-row items-center flex-1">
          <RouterBackArrow />
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

      <View className="flex-1 px-2 py-2">
        {viewMode === "days" ? (
          <View className="flex-1">
            <View className="mb-2">
              <MonthSelector
                currentMonth={currentMonth}
                currentYear={currentYear}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                formatMonthYear={formatMonthYear}
              />
            </View>
            <View className="flex-1">
              <FlatList
                data={dailySummaries}
                renderItem={renderDayItem}
                keyExtractor={(item) => item.date}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <View>
              <SummarySquare />
            </View>
          </View>
        ) : (
          <FlatList
            data={monthlySummaries.years}
            keyExtractor={(year) => year.toString()}
            renderItem={({ item: year }) => (
              <View key={year}>
                <View className="bg-gray-800 py-2 px-2 mb-2 rounded-lg items-center justify-center">
                  <Text className="text-white font-bold text-lg">{year}</Text>
                </View>
                <FlatList
                  data={monthlySummaries.dataByYear[year]}
                  renderItem={renderMonthItem}
                  keyExtractor={(item) => `${item.year}-${item.month}`}
                  scrollEnabled={true}
                />
              </View>
            )}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProductDetail;
