import { Image, Text } from "react-native";

const GoogleLoginButton = () => {
  return (
    <>
      <Image
        source={{
          uri: "https://img.icons8.com/?size=500&id=17949&format=png&color=000000",
        }}
        className="w-5 h-5 mr-3"
      />
      <Text className="text-gray-700 font-medium">Continuar con Google</Text>
    </>
  );
};

GoogleLoginButton.propTypes = {};

export default GoogleLoginButton;
