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
  Button,
} from "../app/shared"; // Centralized imports
import ColorPicker, { Swatches } from "reanimated-color-picker";
import * as Google from "expo-auth-session/providers/google";
interface User {
  authProvider: String;
  providerId: String;
  email: String;
  name: String;
  passwordHash: String;
}
const API_URL =
  Constants.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

export default function HomeScreen() {
  const [categories, setcategories] = useState([]);
  const [IsPickerVisible, setIsPickerVisible] = useState(false); // To toggle color picker modal
  const [colors, setColors] = useState<{ [key: string]: string }>({}); // Object to hold colors for each category
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // Category ID for which color is being changed
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "111790790742-bg3j6m60h4vn5tde5542segocpt6v0c9.apps.googleusercontent.com",
    androidClientId:
      "111790790742-2sg4mh0s4ibguf58th5lnjh7katdrak7.apps.googleusercontent.com",
    iosClientId:
      "111790790742-kouha1h6vsf4m7tbigbe7snjl864tmt6.apps.googleusercontent.com",
  });

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

  useEffect(() => {
    getCurrentUser();
  }, []);

  // Paso 2: Verificamos si se recibió respuesta de Google
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      getGoogleUserInfo(authentication?.accessToken);
    }
  }, [response]);

  // Paso 3: Obtenemos perfil desde Google y lo enviamos al backend
  const getGoogleUserInfo = async (accessToken?: string) => {
    if (!accessToken) return;
    const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await res.json();

    const { data } = await axios.post(`${API_URL}/google`, {
      providerId: profile.id,
      name: profile.name,
      email: profile.email,
    });

    await AsyncStorage.setItem("token", data.token);
    setUser(data.user);
  };

  // Paso 4: Comprobar token si ya está guardado (autologin)
  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
    } catch {
      await AsyncStorage.removeItem("token");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
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
          {user ? (
            <>
              <Text>Bienvenido, {user.name}</Text>
              <Text>Tipo de login: {user.authProvider}</Text>
              <Button title="Cerrar sesión" onPress={logout} />
            </>
          ) : (
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-3xl py-4 px-6  mb-4 shadow-sm"
              activeOpacity={0.7}
              onPress={() => promptAsync()}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=500&id=17949&format=png&color=000000",
                }}
                className="w-10 h-10 mr-3"
              />
              <Text className="text-gray-700 font-medium">
                Continuar con Google
              </Text>
            </TouchableOpacity>
          )}
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
                  onComplete={({ hex }: { hex: string }) => {
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
