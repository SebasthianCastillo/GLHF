import CustomButton from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useState,
  useCallback,
  router,
  axios,
  Constants,
  Image,
  useEffect,
  Modal,
  Text,
  useFocusEffect,
  Pressable,
  ActivityIndicator,
} from "../app/shared"; // Centralized imports
import ColorPicker, { Swatches } from "reanimated-color-picker";

const API_URL =
  Constants.manifest?.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

export default function HomeScreen() {
  const [categories, setcategories] = useState([]);
  const [IsPickerVisible, setIsPickerVisible] = useState(false); // To toggle color picker modal
  const [colors, setColors] = useState<{ [key: string]: string }>({}); // Object to hold colors for each category
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // Category ID for which color is being changed
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      CallCategories();
    }, [])
  );

  const CallCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setcategories(response.data);
    } catch (error) {
      console.log("error fetching categories data", error);
    }
  };

  const onRefreshingProducts = async () => {
    CallCategories();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const navigateToProductosFromCategory = (category: object) => {
    router.push({
      pathname: "/Products",
      params: { category: JSON.stringify(category) },
    });
  };

  const OnPressColorChange = (categoryId: any) => {
    setSelectedCategoryId(categoryId); // Set the current category ID
    setIsPickerVisible(true);
  };

  useEffect(() => {
    const loadColors = async () => {
      try {
        const savedColors = await AsyncStorage.getItem("categoryColors");
        if (savedColors) {
          setColors(JSON.parse(savedColors)); // Set the saved colors
        }
      } catch (error) {
        console.log("Error loading colors:", error);
      }
    };
    loadColors();
  }, []);

  const handleColorChange = async (newColor: any) => {
    if (selectedCategoryId !== null) {
      const updatedColors = { ...colors, [selectedCategoryId]: newColor };
      setColors(updatedColors);

      try {
        await AsyncStorage.setItem(
          "categoryColors",
          JSON.stringify(updatedColors)
        ); // Save the new colors to AsyncStorage
      } catch (error) {
        console.log("Error saving colors:", error);
      }
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <Pressable onPress={onRefreshingProducts} className="pt-2 pl-4">
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <Ionicons name="reload" size={34} color="white" />
        )}
      </Pressable>

      <ScrollView>
        <TouchableOpacity className="w-full flex justify-center items-center h-full px-5">
          <View className="items-center pb-10">
            <Text className="text-slate-300 font-bold text-2xl">
              Captain Chef
            </Text>
            <Image
              source={require("../assets/images/CaptainChefPNG.png")} // Logo
              style={{ width: 180, height: 180 }}
            />
          </View>
          {categories.map((category: any) => (
            <CustomButton
              containerStyles="w-full m-2"
              text={category.Name}
              HandlePress={() => navigateToProductosFromCategory(category)}
              HandleOnLongPress={() => OnPressColorChange(category._id)} // Show color picker on long press
              style={{
                backgroundColor: colors[category._id] || "#F59E0B",
              }}
              size={"text-lg"}
              showIcon={true}
              containerStylesText="pl-8"
            />
          ))}

          <TouchableOpacity
            activeOpacity={0.7}
            className="p-10"
            onPress={() => router.push("/AddCategory")}
          >
            <View
              className={`w-16 h-16 rounded-full bg-yellow-500 shadow-lg justify-center items-center`}
            >
              <FontAwesome6 name="add" size={40} color="white" />
            </View>
          </TouchableOpacity>

          {/* Modal for color picker */}
          <Modal
            visible={IsPickerVisible}
            transparent={true}
            animationType="slide"
          >
            <View className="flex-1 justify-center items-center bg-primary bg-opacity-50">
              <View className="w-4/5 bg-primary p-5 rounded-lg items-center">
                <ColorPicker
                  style={{ width: "70%" }}
                  value={colors[selectedCategoryId] || "red"}
                  onComplete={({ hex }) => {
                    handleColorChange(hex);
                    setIsPickerVisible(false);
                  }}
                >
                  <Swatches />
                </ColorPicker>
                <View className="items-center p-4">
                  <CustomButton
                    containerStyles="w-32 m-2 items-center"
                    text={"Volver"}
                    HandlePress={() => setIsPickerVisible(false)}
                    size={"text-lg"}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
