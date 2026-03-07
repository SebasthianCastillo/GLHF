import { useLocalSearchParams } from "expo-router";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  useFocusEffect,
} from "./lib/shared";
import {
  fetchProductDetailsById,
  fetchMonthlySummaries,
  formatMonthYear,
  filterByMonth,
  getPreviousMonth,
  getNextMonth,
  getMonthNames,
} from "./api/productDetail";
import type { DailySummary } from "./api/productDetail";
import { MonthSelector } from "@/components/ProductDetail/MonthSelector";
import { TransactionDayItem } from "@/components/ProductDetail/TransactionDayItem";
import SummarySquare from "@/components/ProductDetail/SummarySquare";
import { useSummaryStore } from "@/store/useSummaryStore";
import { AggregationResult } from "./lib/types";
import RouterBackArrow from "@/components/RouterBackArrow";
import LoadingIndicator from "@/components/LoadingIndicator";
import { FontAwesome5 } from "@expo/vector-icons";

const ProductDetail = () => {
  const { product } = useLocalSearchParams();

  const [filteredDetails, setFilteredDetails] = useState<
    DailySummary["transactions"]
  >([]);
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const {
    productDetailSummaryAdd: ProductDetailSummaryAdd,
    setProductDetailSummaryAdd,
    productDetailSummaryMinus: ProductDetailSummaryMinus,
    setProductDetailSummaryMinus,
  } = useSummaryStore();
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"days" | "months">("days");
  const [monthlySummaries, setMonthlySummaries] = useState<AggregationResult>({
    years: [],
    dataByYear: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const productObject = Array.isArray(product)
    ? JSON.parse(product[0])
    : JSON.parse(product || "{}");

  // #region Functions
  // carga lista de historial de productos
  useFocusEffect(
    useCallback(() => {
      const productDetailFunction = async () => {
        try {
          console.log("productObject", productObject);
          setIsLoading(true);
          const data = await fetchProductDetailsById(productObject._id);

          filterByMonth(data, currentMonth, currentYear, productObject._id, {
            setFilteredDetails,
            setDailySummaries,
            setProductDetailSummaryAdd,
            setProductDetailSummaryMinus,
          });
        } catch (error) {
          console.log(
            "error fetching products detail by id data or month dosent have products",
            error,
          );
          setProductDetailSummaryAdd(0);
          setProductDetailSummaryMinus(0);
        } finally {
          setIsLoading(false);
        }
      };

      productDetailFunction();
    }, [currentMonth, currentYear]),
  );

  const getMonthlySummaries = async () => {
    try {
      const data = await fetchMonthlySummaries(productObject._id);

      setMonthlySummaries(data);
    } catch (error) {
      console.log("error fetching monthly summaries data", error);
    }
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

  // setea cambio de mes en vista producto detail
  const handlePrevMonth = () => {
    const { month, year } = getPreviousMonth(currentMonth, currentYear);
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  // setea cambio de mes en vista producto detail
  const handleNextMonth = () => {
    const { month, year } = getNextMonth(currentMonth, currentYear);
    setCurrentMonth(month);
    setCurrentYear(year);
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
    const monthNames = getMonthNames();
    const monthKey = `${monthNames[item.month - 1]}`;
    const today = new Date();
    const monthIndex = today.getMonth();
    const isMonth =
      item.month - 1 === monthIndex && item.year === today.getFullYear();
    return (
      <View className="mb-3">
        <View className="flex-row justify-between items-center bg-[#272727] p-4 pl-4 rounded-2xl">
          <View className="flex-row items-center">
            <View>
              <Text className="text-white text-base font-semibold capitalize">
                {monthKey}
              </Text>
            </View>
            {isMonth && (
              <View className="ml-2 px-2 py-0.5 bg-[#F59E0B]/80 rounded-full">
                <Text className="text-black text-xs font-medium">Actual</Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center gap-8">
            <View className="items-center min-w-[50px]">
              <Text className="text-[#2ba640] font-bold text-lg">
                +{item.added}
              </Text>
              <Text className="text-[#aaa] text-[10px]">Agregados</Text>
            </View>
            <View className="items-center min-w-[50px]">
              <Text className="text-[#F59E0B] font-bold text-lg">
                -{item.removed}
              </Text>
              <Text className="text-[#aaa] text-[10px]">Retirados</Text>
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
    <View className="flex-1 items-center justify-center py-16">
      <View className="w-16 h-16 rounded-full bg-[#272727] items-center justify-center mb-4">
        <FontAwesome5 name="box-open" size={28} color="#666" />
      </View>
      <Text className="text-[#aaa] text-base font-medium">
        {viewMode === "days"
          ? "No hay movimientos este mes"
          : "No hay datos mensuales disponibles"}
      </Text>
    </View>
  );
  // #endregion
  return (
    <SafeAreaView className="bg-[#0f0f0f] flex-1">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#3f3f3f] bg-[#0f0f0f]">
        <View className="flex-row items-center flex-1">
          <RouterBackArrow />
          <Text className="text-white text-xl font-bold ml-2">
            {productObject.Name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleViewMode}
          className="px-4 py-2 bg-[#272727] rounded-lg"
        >
          <Text className="text-white font-medium text-sm">
            {viewMode === "days" ? "Por Mes" : "Por Días"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-4 py-4">
        {viewMode === "days" ? (
          <View className="flex-1">
            <View className="mb-4">
              <MonthSelector
                currentMonth={currentMonth}
                currentYear={currentYear}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                formatMonthYear={formatMonthYear}
              />
            </View>
            <View className="flex-1">
              {isLoading ? (
                <LoadingIndicator />
              ) : (
                <FlatList
                  data={dailySummaries}
                  renderItem={renderDayItem}
                  keyExtractor={(item) => item.date}
                  ListEmptyComponent={renderEmptyComponent}
                  contentContainerStyle={{ paddingBottom: 120 }}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
            <View className="pt-4">
              <SummarySquare />
            </View>
          </View>
        ) : (
          <FlatList
            data={monthlySummaries.years}
            keyExtractor={(year) => year.toString()}
            renderItem={({ item: year }) => (
              <View key={year}>
                <View className="py-3 px-2 mb-3 border-b border-[#3f3f3f]">
                  <Text className="text-[#aaa] font-semibold text-sm tracking-wide">
                    {year}
                  </Text>
                </View>
                <FlatList
                  data={monthlySummaries.dataByYear[year]}
                  renderItem={renderMonthItem}
                  keyExtractor={(item) => `${item.year}-${item.month}`}
                  scrollEnabled={true}
                  contentContainerStyle={{ paddingBottom: 20 }}
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
