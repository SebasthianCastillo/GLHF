import { Image, Text, View } from "react-native";

const GoogleLoginButton = () => {
  return (
    <View className="flex-row items-center">
      <Image
        source={{
          uri: "https://img.icons8.com/?size=500&id=17949&format=png&color=000000",
        }}
        className="w-5 h-5 mr-3"
      />
      <Text className="text-black font-semibold">Continuar con Google</Text>
    </View>
  );
};

GoogleLoginButton.propTypes = {};

export default GoogleLoginButton;
