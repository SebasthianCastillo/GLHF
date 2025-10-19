import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useUserStore } from "../store/useUserStore";
import Constants from "expo-constants";
import { Platform } from "react-native";
import axios from "axios";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

const API_URL =
  Constants.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

export const usePushNotifications = (): PushNotificationState => {
  const user = useUserStore((state) => state.user);

  // Configure how notifications are handled when received
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // 🔹 Register for push notifications
  async function registerForPushNotificationsAsync() {
    let token;

    if (!Device.isDevice) {
      console.log("Must use a physical device for push notifications!");
      return;
    }

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.error("Expo project ID not found in app config");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({ projectId });
    } catch (error) {
      console.error("Error getting push token:", error);
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // 🔹 Save token to backend (only if user exists)
    if (user?.email && token?.data) {
      try {
        await axios.post(`${API_URL}/saveTokenUserNotification`, {
          userEmail: user.email,
          expoPushToken: token.data,
        });
        console.log("✅ Token saved successfully");
      } catch (err) {
        console.error("❌ Error saving token:", err);
      }
    }

    return token;
  }

  // 🔹 Run setup
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    // Listen for incoming notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notif) => {
        setNotification(notif);
      });

    // Listen for user interaction (tap on notification)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User interacted with notification:", response);
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [user]);

  return {
    expoPushToken,
    notification,
  };
};
