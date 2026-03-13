import os from "os";

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

export default {
  expo: {
    name: "Captain Chef",
    slug: "GLHF",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "com.sebb21glhf",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      bundleIdentifier: "com.sebb21glhf",
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/CaptainChef.jpg",
        backgroundColor: "#ffffff",
      },
      package: "com.sebb21glhf",
      googleServicesFile: "./google-services.json",
      useNextNotificationsApi: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#ffffff",
          sounds: [],
        },
      ],
      "@react-native-firebase/app",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "c69b3306-b872-4414-a490-dedbd3b5cfb6",
      },
      // API_URL: `http://${getLocalIP()}:5000`,
      API_URL: `https://glhf.onrender.com`,
      WEB_CLIENT_ID_GOOGLE:
        "305169218247-rd7peu927l4f43nhl6ecuj79rumi8ueu.apps.googleusercontent.com",
    },
  },
};
