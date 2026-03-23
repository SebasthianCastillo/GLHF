import AsyncStorage from "@react-native-async-storage/async-storage";

export {} from "../lib/shared";
import {
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useCallback,
  router,
  axios,
  Constants,
  Image,
  useFocusEffect,
  Pressable,
  Text,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "../lib/shared";
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { useUserStore } from "@/store/useUserStore";
import { usePushNotifications } from "@/services/usePushNotifications";
import FilteredCategoriesList from "@/components/categoriesScreen/FilteredCategoriesList";
import ProfileModal from "@/components/ProfileModal";
import { useState } from "react";
import GoogleLoginButton from "@/components/GoogleLogin/GoogleLoginButton";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { expoPushToken, notification } = usePushNotifications();
  const user = useUserStore((state) => state.user);

  const API_URL =
    Constants.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;
  const WEB_CLIENT_ID_GOOGLE =
    Constants.extra?.WEB_CLIENT_ID_GOOGLE ||
    Constants.expoConfig?.extra?.WEB_CLIENT_ID_GOOGLE;

  useFocusEffect(
    useCallback(() => {
      getCurrentUser();
    }, [])
  );

  const data = JSON.stringify(notification, undefined, 2);

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID_GOOGLE,
    profileImageSize: 150,
  });
  const handleGoogleSign = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      getGoogleUserInfo(response);
    } catch (error) {
      console.log("Error en autenticación ", error);
    }
  };

  const getGoogleUserInfo = async (response: User) => {
    try {
      const { data } = await axios.post(`${API_URL}/google`, {
        providerId: response.user.id,
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.photo,
      });

      await AsyncStorage.setItem("token", data.token);
      useUserStore.getState().setUser(data.user);
    } catch (error) {
      console.log("error google data", error);
    }
  };

  async function getCurrentUser() {
    const token = await AsyncStorage.getItem("token");

    if (!token) return;

    try {
      const { data } = await axios.get(`${API_URL}/currentUser`, {
        headers: { authorization: `Bearer ${token}` },
      });

      useUserStore.getState().setUser(data.user);
    } catch (error) {
      console.log("error current user", error);
    }
  }

  const handleLocalAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    if (!isLoginMode && password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLoginMode ? "/login" : "/register";
      const payload = isLoginMode 
        ? { email, password }
        : { email, password, name: name || email.split("@")[0] };

      const { data } = await axios.post(`${API_URL}${endpoint}`, payload);

      await AsyncStorage.setItem("token", data.token);
      useUserStore.getState().setUser(data.user);
      
      setEmail("");
      setPassword("");
      setName("");
    } catch (error: any) {
      const message = error.response?.data?.message || "An error occurred";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/forgot-password`, {
        email: forgotEmail,
      });
      Alert.alert("Success", data.message);
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (error: any) {
      const message = error.response?.data?.message || "An error occurred";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-black flex-1">
      <View className="bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800">
        <View className="flex-row justify-between items-center px-4 py-3">
          <View className="flex-row items-center gap-3">
            {user && (
              <Pressable onPress={() => router.push("/SettingScreen")}>
                <Ionicons name="settings-outline" size={24} color="#A3A3A3" />
              </Pressable>
            )}
          </View>
          <View className="flex-row items-center gap-2">
            <Image
              source={require("../../assets/images/CaptainChefPNG.png")}
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
            />
            <Text className="text-white text-lg font-bold tracking-tight">
              Captain<Text className="text-amber-500">Chef</Text>
            </Text>
          </View>
          {user ? (
            <Pressable
              onPress={() => setShowProfileModal(true)}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-500"
            >
              <Image
                source={{
                  uri:
                    (user.avatar as string) ||
                    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </Pressable>
          ) : (
            <View className="w-10" />
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="pt-4 pb-4">
          <Text className="text-white text-base font-semibold px-4 mb-3">
            Tus Categorías
          </Text>
          <FilteredCategoriesList />
        </View>

        {!user && (
          <View className="px-4 py-6">
            <View className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 items-center">
              <View className="w-16 h-16 rounded-full bg-amber-500/20 items-center justify-center mb-3">
                <Ionicons name="person-add-outline" size={32} color="#F59E0B" />
              </View>
              <Text className="text-white text-lg font-semibold mb-2">
                {isLoginMode ? "¡Bienvenido de nuevo!" : "¡Únete a Captain Chef!"}
              </Text>
              <Text className="text-neutral-400 text-sm text-center mb-5">
                {isLoginMode 
                  ? "Ingresa con tu correo y contraseña" 
                  : "Guarda tus recetas y categorías en la nube"}
              </Text>

              {!isLoginMode && (
                <TextInput
                  className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 mb-3 border border-neutral-700"
                  placeholder="Nombre"
                  placeholderTextColor="#737373"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              )}
              <TextInput
                className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 mb-3 border border-neutral-700"
                placeholder="Correo electrónico"
                placeholderTextColor="#737373"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 mb-2 border border-neutral-700"
                placeholder="Contraseña"
                placeholderTextColor="#737373"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />

              {isLoginMode && (
                <TouchableOpacity
                  className="self-end mb-4"
                  onPress={() => setShowForgotPassword(true)}
                >
                  <Text className="text-amber-500 text-sm">¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="w-full bg-amber-500 rounded-xl py-3.5 items-center mb-3"
                activeOpacity={0.8}
                onPress={handleLocalAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">
                    {isLoginMode ? "Iniciar sesión" : "Crear cuenta"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="mb-4"
                onPress={() => {
                  setIsLoginMode(!isLoginMode);
                  setEmail("");
                  setPassword("");
                  setName("");
                }}
              >
                <Text className="text-neutral-400 text-sm">
                  {isLoginMode ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                  <Text className="text-amber-500 font-semibold">
                    {isLoginMode ? "Regístrate" : "Inicia sesión"}
                  </Text>
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center w-full mb-4">
                <View className="flex-1 h-px bg-neutral-700" />
                <Text className="text-neutral-500 text-sm mx-3">o</Text>
                <View className="flex-1 h-px bg-neutral-700" />
              </View>

              <TouchableOpacity
                className="w-full bg-white rounded-xl py-3.5 items-center"
                activeOpacity={0.8}
                onPress={() => handleGoogleSign()}
              >
                <GoogleLoginButton />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      {user ? (
        <View className="absolute bottom-6 right-6 items-center">
          <TouchableOpacity
            className="w-14 h-14 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30 justify-center items-center"
            activeOpacity={0.8}
            onPress={() => router.push("../AddCategory")}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-neutral-500 text-xs mt-1.5 font-medium">
            Agregar
          </Text>
        </View>
      ) : null}
      <View className="h-20" />
      <ProfileModal
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />
      <Modal
        visible={showForgotPassword}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotPassword(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-neutral-900 w-full max-w-sm rounded-2xl p-6 border border-neutral-800">
            <Text className="text-white text-xl font-bold mb-2">
              Recuperar contraseña
            </Text>
            <Text className="text-neutral-400 text-sm mb-4">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </Text>
            <TextInput
              className="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 mb-4 border border-neutral-700"
              placeholder="Correo electrónico"
              placeholderTextColor="#737373"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-neutral-700 rounded-xl py-3 items-center"
                onPress={() => {
                  setShowForgotPassword(false);
                  setForgotEmail("");
                }}
              >
                <Text className="text-white font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-amber-500 rounded-xl py-3 items-center"
                onPress={handleForgotPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Enviar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}