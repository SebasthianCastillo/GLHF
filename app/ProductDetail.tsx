import { useLocalSearchParams } from "expo-router";
import { useState, useCallback, useMemo } from "react";
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
import CalendarPicker from "@/components/ProductDetail/CalendarPicker";
import { type ProductMovement } from "./api/products";
import { useProductMovements } from "@/hooks/useProductMovements";

import { useProductMovementsByMonths } from "@/hooks/useProductMovementsByMonths";
import MonthYearPicker from "@/components/MonthYearPicker/MonthYearPicker";
import MonthCalendarInline from "@/components/MonthYearPicker/MonthCalendarInline";
import { useMonthSelectionStore } from "@/store/useMonthSelectionStore";

const ProductDetail = () => {
  const { product, category } = useLocalSearchParams();

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

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expandedProducts, setExpandedProducts] = useState<
    Record<string, boolean>
  >({});
  const [showCalendar, setShowCalendar] = useState(false);

  // Estados para modo "months" (vista por mes)
  const [selectedMonthForView, setSelectedMonthForView] = useState<number>(
    new Date().getMonth(),
  );
  const [selectedYearForView, setSelectedYearForView] = useState<number>(
    new Date().getFullYear(),
  );
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  // Store para selección de meses
  const { selectedMonths, getDisplayText } = useMonthSelectionStore();

  const productObject = useMemo(() => {
    if (Array.isArray(product)) {
      return JSON.parse(product[0]);
    }
    return JSON.parse(product || "{}");
  }, [product]);

  const categoryObject = useMemo(() => {
    if (Array.isArray(category)) {
      return JSON.parse(category[0]);
    }
    return JSON.parse(category || "{}");
  }, [category]);

  const isCategoryMode = !!categoryObject.id;

  // React Query para movimientos de productos por fecha
  // Usar formato local para evitar problemas de timezone
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;
  const {
    data: productMovements = [],
    isLoading,
    refetch: refetchMovements,
  } = useProductMovements(categoryObject.id || "", dateStr);

  // React Query para movimientos de productos por meses seleccionados
  const {
    data: productMovementsByMonth = [],
    isLoading: isLoadingMonthly,
    refetch: refetchMovementsByMonth,
  } = useProductMovementsByMonths(categoryObject.id || "", selectedMonths);

  const handlePrevMonth = () => {
    const { month, year } = getPreviousMonth(currentMonth, currentYear);
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleNextMonth = () => {
    const { month, year } = getNextMonth(currentMonth, currentYear);
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleRefreshMovements = () => {
    refetchMovements();
  };

  useFocusEffect(
    useCallback(() => {
      const productDetailFunction = async () => {
        try {
          setIsLoadingSingle(true);
          const data = await fetchProductDetailsById(productObject.id);

          filterByMonth(data, currentMonth, currentYear, productObject.id, {
            setFilteredDetails,
            setDailySummaries,
            setProductDetailSummaryAdd,
            setProductDetailSummaryMinus,
          });
        } catch (error) {
          console.log(
            "error fetching products detail by id data or month dosent have products",
          );
          setProductDetailSummaryAdd(0);
          setProductDetailSummaryMinus(0);
        } finally {
          setIsLoadingSingle(false);
        }
      };

      if (!isCategoryMode) {
        productDetailFunction();
      }
    }, [currentMonth, currentYear, productObject.id, isCategoryMode]),
  );

  const getMonthlySummaries = async () => {
    try {
      const data = await fetchMonthlySummaries(productObject.id);
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

  const toggleProductExpanded = (productId: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const [isLoadingSingle, setIsLoadingSingle] = useState(false);

  const toggleViewMode = useCallback(() => {
    if (viewMode === "days" && !isCategoryMode) {
      getMonthlySummaries();
    }
    setViewMode((prev) => (prev === "days" ? "months" : "days"));
  }, [viewMode, isCategoryMode]);

  // Handlers para vista "months"
  const handlePrevMonthForView = () => {
    if (selectedMonthForView === 0) {
      setSelectedMonthForView(11);
      setSelectedYearForView(selectedYearForView - 1);
    } else {
      setSelectedMonthForView(selectedMonthForView - 1);
    }
  };

  const handleNextMonthForView = () => {
    if (selectedMonthForView === 11) {
      setSelectedMonthForView(0);
      setSelectedYearForView(selectedYearForView + 1);
    } else {
      setSelectedMonthForView(selectedMonthForView + 1);
    }
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
        <View className="flex-row justify-between items-center bg-[#272727] p-4 pl-4 ">
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
                {item.added}
              </Text>
              <Text className="text-[#aaa] text-[10px]">Agregados</Text>
            </View>
            <View className="items-center min-w-[50px]">
              <Text className="text-[#F59E0B] font-bold text-lg">
                {item.removed}
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

  // Render para vista "months" - lista de productos con totales mensuales
  const renderMonthlyProductItem = ({ item }: { item: ProductMovement }) => (
    <View className="mb-3">
      <View className="flex-row justify-between items-center bg-[#272727] p-4">
        <View className="flex-1">
          <Text className="text-white text-base font-semibold">
            {item.productName}
          </Text>
        </View>
        <View className="flex-row items-center gap-6">
          <View className="items-center min-w-[50px]">
            <Text className="text-[#2ba640] font-bold text-lg">
              {item.added}
            </Text>
            <Text className="text-[#aaa] text-[10px]">Agregados</Text>
          </View>
          <View className="items-center min-w-[50px]">
            <Text className="text-[#F59E0B] font-bold text-lg">
              {item.removed}
            </Text>
            <Text className="text-[#aaa] text-[10px]">Retirados</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderProductMovementItem = ({ item }: { item: ProductMovement }) => {
    const isExpanded = !!expandedProducts[item.productId];
    const hasMovements = item.movements && item.movements.length > 0;

    return (
      <View className="mb-3">
        <TouchableOpacity
          onPress={() => toggleProductExpanded(item.productId)}
          className="flex-row justify-between items-center bg-[#272727] p-4"
        >
          <View className="flex-1">
            <Text className="text-white text-base font-semibold">
              {item.productName}
            </Text>
          </View>
          <View className="flex-row items-center gap-6">
            <View className="items-center min-w-[50px]">
              <Text className="text-[#2ba640] font-bold text-lg">
                {item.added}
              </Text>
              <Text className="text-[#aaa] text-[10px]">Agregados</Text>
            </View>
            <View className="items-center min-w-[50px]">
              <Text className="text-[#F59E0B] font-bold text-lg">
                {item.removed}
              </Text>
              <Text className="text-[#aaa] text-[10px]">Retirados</Text>
            </View>
            {hasMovements && (
              <View className="ml-2">
                <FontAwesome5
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#aaa"
                />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && hasMovements && (
          <View className="bg-[#1a1a1a] px-4 pb-4">
            {item.movements.map((movement) => (
              <View
                key={movement.id}
                className="flex-row justify-between items-center py-3 border-b border-[#333]"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={`w-2 h-2 rounded-full ${
                      movement.operation === "add"
                        ? "bg-[#2ba640]"
                        : "bg-[#F59E0B]"
                    }`}
                  />
                  <Text className="text-white text-sm">
                    {movement.quantity}x {movement.format}
                  </Text>
                </View>
                <Text className="text-[#aaa] text-xs">
                  {new Date(movement.date).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View className="flex-1 items-center justify-center py-16">
      <View className="w-16 h-16 rounded-full bg-[#272727] items-center justify-center mb-4">
        <FontAwesome5 name="box-open" size={28} color="#666" />
      </View>
      <Text className="text-[#aaa] text-base font-medium">
        {viewMode === "days"
          ? isCategoryMode
            ? "No hay movimientos este día"
            : "No hay movimientos este mes"
          : "No hay datos mensuales disponibles"}
      </Text>
    </View>
  );

  const headerTitle = isCategoryMode
    ? categoryObject.name || "Productos"
    : productObject.Name || "Detalle";

  return (
    <SafeAreaView className="bg-[#0f0f0f] flex-1">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#3f3f3f] bg-[#0f0f0f]">
        <View className="flex-row items-center flex-1">
          <RouterBackArrow />
          <Text className="text-white text-xl font-bold ml-2" numberOfLines={1}>
            {headerTitle}
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

      <View className={`flex-1 ${viewMode === "days" ? "px-2" : "px-0"} py-4`}>
        {viewMode === "days" ? (
          isCategoryMode ? (
            <View className="flex-1">
              <View className="mb-4">
                {/* Date Selector - Modern Card Style */}
                <TouchableOpacity
                  onPress={() => setShowCalendar(!showCalendar)}
                  activeOpacity={0.7}
                  className="flex-row items-center bg-[#1c1c1e] py-[14px] px-4 rounded-[12px] border border-[#38383a]"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-9 h-9 rounded-[8px] bg-[#ff9500]/15 flex items-center justify-center">
                      <FontAwesome5
                        name="calendar-day"
                        size={16}
                        color="#ff9500"
                      />
                    </View>
                    <Text className="text-white text-[17px] font-medium ml-3">
                      {selectedDate.toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })}
                    </Text>
                  </View>
                  <FontAwesome5
                    name={showCalendar ? "chevron-up" : "chevron-down"}
                    size={14}
                    color="#636366"
                  />
                </TouchableOpacity>

                {/* Calendario */}
                {showCalendar && (
                  <View className="mt-2">
                    <CalendarPicker
                      selectedDate={selectedDate}
                      onDateSelect={(date) => {
                        handleDateSelect(date);
                        setShowCalendar(false);
                      }}
                      currentMonth={currentMonth}
                      currentYear={currentYear}
                      onPrevMonth={handlePrevMonth}
                      onNextMonth={handleNextMonth}
                    />
                  </View>
                )}
              </View>
              <View className="flex-1">
                {isLoading ? (
                  <LoadingIndicator />
                ) : (
                  <FlatList
                    data={productMovements}
                    renderItem={renderProductMovementItem}
                    keyExtractor={(item) => item.productId}
                    ListEmptyComponent={renderEmptyComponent}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            </View>
          ) : (
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
                {isLoadingSingle ? (
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
          )
        ) : isCategoryMode ? (
          // Vista "months" para categoría: selector de mes/año + lista de productos
          <View className="flex-1">
            <View className="mb-4 px-2">
              {/* Month/Year Selector - Expandable */}
              <View>
                {/* Button to toggle */}
                <TouchableOpacity
                  onPress={() => setShowMonthYearPicker(!showMonthYearPicker)}
                  activeOpacity={0.7}
                  className="flex-row items-center bg-[#1c1c1e] py-[14px] px-4 rounded-[12px] border border-[#38383a]"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-9 h-9 rounded-[8px] bg-[#ff9500]/15 flex items-center justify-center">
                      <FontAwesome5
                        name="calendar-day"
                        size={16}
                        color="#ff9500"
                      />
                    </View>
                    <Text className="text-white text-[17px] font-medium ml-3">
                      {getDisplayText()}
                    </Text>
                  </View>
                  <FontAwesome5
                    name={showMonthYearPicker ? "chevron-up" : "chevron-down"}
                    size={14}
                    color="#636366"
                  />
                </TouchableOpacity>

                {/* Inline Calendar Grid */}
                {showMonthYearPicker && (
                  <View className="mt-2">
                    <MonthCalendarInline />
                  </View>
                )}
              </View>
            </View>
            <View className="flex-1 px-2">
              {isLoadingMonthly ? (
                <LoadingIndicator />
              ) : (
                <FlatList
                  data={productMovementsByMonth}
                  renderItem={renderMonthlyProductItem}
                  keyExtractor={(item) => item.productId}
                  ListEmptyComponent={renderEmptyComponent}
                  contentContainerStyle={{ paddingBottom: 120 }}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
        ) : (
          // Vista "months" para producto individual: mostrar historial por mes
          <FlatList
            data={monthlySummaries.years}
            keyExtractor={(year) => year.toString()}
            renderItem={({ item: year }) => (
              <View key={year}>
                <View className="py-3 px-2 items-center">
                  <Text className="text-[#aaa] font-semibold text-base tracking-wide">
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

      {/* Month Year Picker Modal (hidden, using inline instead) */}
      <MonthYearPicker
        visible={false}
        onClose={() => setShowMonthYearPicker(false)}
        onConfirm={() => setShowMonthYearPicker(false)}
      />
    </SafeAreaView>
  );
};

export default ProductDetail;
