import AsyncStorage from "@react-native-async-storage/async-storage";
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
} from "./lib/shared"; // Centralized imports
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import ButtonLink from "@/components/ButtonLink";
import { useUserStore } from "@/store/useUserStore";
import { usePushNotifications } from "@/services/usePushNotifications";
import FilteredCategoriesList from "@/components/categoriesScreen/FilteredCategoriesList";
import ProfileModal from "@/components/ProfileModal";
import { useState } from "react";
import SettingButton from "@/components/Settings/SettingButton";
import Logo from "@/components/Logo";
import GoogleLoginButton from "@/components/GoogleLogin/GoogleLoginButton";

export default function HomeScreen() {
  const [showProfileModal, setShowProfileModal] = useState(false);
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

  // #region Google Auth
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
  // Paso 3: Obtenemos perfil desde Google y lo enviamos al backend
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
      // await AsyncStorage.removeItem("token");
    }
  };

  // Paso 4: Comprobar token si ya está guardado (autologin)
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
      // await AsyncStorage.removeItem("token");
    }
  }
  //#endregion

  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="flex-row justify-between items-start pt-3 px-4">
        <SettingButton />
        {user && (
          <View className="items-end">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => setShowProfileModal(true)}
                className="w-11 h-11 rounded-full bg-white overflow-hidden border-2 border-white"
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
            </View>
          </View>
        )}
      </View>
      <ScrollView>
        <TouchableOpacity className="w-full flex justify-center items-center h-full px-5">
          <Logo />
          <FilteredCategoriesList />
          {!user && (
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-3xl py-4 px-6  mb-4 shadow-sm"
              activeOpacity={0.7}
              onPress={() => handleGoogleSign()}
            >
              <GoogleLoginButton />
            </TouchableOpacity>
          )}
          <View className="h-8" />
          <ButtonLink
            logotype={"add"}
            backgroundColor={"bg-yellow-500"}
            onPress={() => router.push("../AddCategory")}
          ></ButtonLink>
        </TouchableOpacity>
      </ScrollView>
      <ProfileModal
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
      />
    </SafeAreaView>
  );
}
