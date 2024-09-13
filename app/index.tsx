import CustomButton from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorPicker } from "react-native-color-picker";
import { useFonts } from "expo-font";
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
  useEffect,
  Modal,
  Button,
} from "../app/shared"; // Centralized imports

const API_URL =
  Constants.manifest?.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

export default function HomeScreen() {
  const [categories, setcategories] = useState([]);
  const [IsRefreshing, setIsRefreshing] = useState(false);
  const [IsPickerVisible, setIsPickerVisible] = useState(false); // To toggle color picker modal
  const { top } = useSafeAreaInsets();
  const [colors, setColors] = useState<{ [key: string]: string }>({}); // Object to hold colors for each category
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Category ID for which color is being changed
  const [loaded] = useFonts({
    Monserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
  });
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

  //funcion que se activa cuando se hace pull to refresh
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

  const OnPressColorChange = (categoryId: any) => {
    setSelectedCategoryId(categoryId); // Set the current category ID
    setIsPickerVisible(true);
  };

  // Load colors from AsyncStorage when the component mounts
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

  // Save the colors to AsyncStorage
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
        <TouchableOpacity className="w-full flex justify-center items-center h-full px-5">
          <View className="items-center pb-28">
            <Image
              source={require("../assets/images/LL.png")} // Logo
              style={{ width: 100, height: 100 }}
            />
          </View>
          {categories.map((category: any) => (
            <CustomButton
              containerStyles="w-full m-2"
              text={category.Name}
              HandlePress={() => navigateToProductosFromCategory(category)}
              HandleOnLongPress={() => OnPressColorChange(category._id)} // Show color picker on long press
              style={{
                backgroundColor: colors[category._id] || "white",
                // Add your font family here
              }}
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
          {/* {IsPickerVisible && ( */}
          <Modal
            visible={IsPickerVisible}
            transparent={true}
            animationType="slide"
          >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
              <View className="w-4/5 bg-primary p-5 rounded-lg">
                <ColorPicker
                  onColorSelected={(color) => {
                    handleColorChange(color);
                    setIsPickerVisible(false); // Close modal after selecting color
                  }}
                  style={{ height: 200 }}
                />
                <Button
                  title="Cancel"
                  onPress={() => setIsPickerVisible(false)}
                />
              </View>
            </View>
          </Modal>
          {/* )} */}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
