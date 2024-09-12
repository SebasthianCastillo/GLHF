import CustomButton from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  useSafeAreaInsets,
  useState,
  useCallback,
  router,
  axios,
  Constants,
  Image,
} from "../app/shared"; // Centralized imports

const API_URL =
  Constants.manifest?.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

export default function HomeScreen() {
  const [categories, setcategories] = useState([]);
  const [IsRefreshing, setIsRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  // Carga lista entre navegaciones automaticamente
  useFocusEffect(
    useCallback(() => {
      const categories = async () => {
        try {
          const response = await axios.get(`${API_URL}/categories`);
          setcategories(response.data);
        } catch (error) {
          console.log("error fetching categories data", error);
        }
      };
      categories();
    }, [])
  );
  const Callcategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setcategories(response.data);
    } catch (error) {
      console.log("error fetching categories data", error);
    }
  };
  const onRefreshingProducts = async () => {
    Callcategories();
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };
  const navigateToProductosFromCategory = (category: object) => {
    router.push({
      pathname: "/Products",
      params: { category: JSON.stringify(category) },
    });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{ height: "100%" }}
        refreshControl={
          <RefreshControl
            refreshing={IsRefreshing}
            progressViewOffset={top}
            onRefresh={onRefreshingProducts}
            colors={["green", "orange"]}
          />
        }
      >
        <View className="w-full flex justify-center items-center h-full px-5">
          <View className="items-center pb-28">
            <Image
              source={require("../assets/images/LL.png")} // Update path to your logo
              style={{ width: 100, height: 100 }} // Adjust size as needed
            />
          </View>
          {categories.map((category: any) => (
            <CustomButton
              containerStyles="w-full m-2"
              text={category.Name}
              HandlePress={() => navigateToProductosFromCategory(category)}
            />
          ))}

          <TouchableOpacity
            activeOpacity={0.7}
            className="p-10"
            onPress={() => router.push("/AddCategory")}
          >
            <View className="w-16 h-16 bg-yellow-500 rounded-full shadow-lg justify-center items-center">
              <FontAwesome6 name="add" size={40} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
