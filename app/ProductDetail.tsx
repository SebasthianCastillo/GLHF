import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
  useState,
  useCallback,
  axios,
  Constants,
  useLocalSearchParams,
  FlatList,
  useFocusEffect,
  React,
} from "../app/shared"; // Centralized imports

const API_URL =
  Constants.manifest?.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

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

  const productObject = Array.isArray(product)
    ? JSON.parse(product[0])
    : JSON.parse(product || "{}");

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
    fetchSummaryData(filtered[0].date);
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

  const formatMonthYear = (month: number, year: number) => {
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
    return `${months[month]}, ${year.toString().slice(-2)}`;
  };

  const renderItem = ({ item }: { item: ProductDetail }) => (
    <View
      className={`p-1 mb-2 ${
        item.operation === "add" ? "bg-emerald-600" : "bg-red-500"
      } rounded-lg shadow-md`}
    >
      <View className="flex-row h-9">
        {/* Cuadro de Cantidad */}
        <View className="flex-1 items-center justify-center border-r border-gray-300">
          <Text className="text-2xl font-bold text-white">{`${
            item.operation === "add" ? "+" : "-"
          } ${item.quantity}`}</Text>
        </View>

        {/* Cuadro de Formato */}
        <View className="flex-1 items-center justify-center border-r border-gray-300">
          <Text className="text-2xl font-bold text-white">{item.format}</Text>
        </View>

        {/* Cuadro de Fecha */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-xm font-bold text-white">
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text className="text-sm font-medium text-white">
            {new Date(item.date).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row items-center justify-between px-4 py-3 bg-primary">
        <TouchableOpacity onPress={handlePrevMonth} className="px-3 py-1">
          <Text className="text-2xl text-yellow-500">&lt;</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">
          {formatMonthYear(currentMonth, currentYear)}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} className="px-3 py-1">
          <Text className="text-2xl text-yellow-500">&gt;</Text>
        </TouchableOpacity>
      </View>
      {/* Header de columnas */}
      <View className="flex-row h-12 bg-primary">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-bold text-white">Cantidad</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-bold text-white">Formato</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-bold text-white">Fecha</Text>
        </View>
      </View>
      <ScrollView>
        <FlatList
          data={filteredDetails}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
        />
      </ScrollView>
      <View className="flex-row justify-between mt-4">
        <View className="h-24 w-36">
          <View className="flex-1 items-center justify-center bg-emerald-600 rounded-lg shadow-lg p-4">
            <Text className="text-3xl font-bold text-white">
              {ProductDetailSummaryAdd}
            </Text>
          </View>
        </View>
        <View className="h-24 w-36">
          <View className="flex-1 items-center justify-center bg-yellow-500 rounded-lg shadow-lg p-4">
            <Text className="text-3xl font-bold text-white pt-5">
              {ProductDetailSummaryAdd - ProductDetailSummaryMinus}
            </Text>
            <Text className="text-center pt-1 ">Disponible</Text>
          </View>
        </View>
        <View className="h-24 w-36">
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
