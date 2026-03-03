import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useUserStore } from "../store/useUserStore";
import Constants from "expo-constants";
import { Platform } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

const API_URL =
  Constants.extra?.API_URL || Constants.expoConfig?.extra?.API_URL;

export const usePushNotifications = (): PushNotificationState => {
  const user = useUserStore((state) => state.user);

  // Configure how notifications are handled when received
  // This sets the global notification behavior for the app

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  // State to store the Expo push token for this device
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  // State to store the most recent notification received
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  // Refs to store notification listener subscriptions
  // These are used to clean up listeners when the component unmounts
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // 🔹 Register for push notifications
  // This function handles the entire registration process for push notifications
  async function registerForPushNotificationsAsync() {
    let token;

    // Check if the app is running on a physical device
    // Push notifications don't work on emulators/simulators
    if (!Device.isDevice) {
      console.log("Must use a physical device for push notifications!");
      return;
    }

    try {
      // Step 1: Check if notification permissions already exist
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Step 2: If permissions not granted, request them from the user
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Step 3: Verify that permissions were granted
      // If not, we can't receive push notifications
      if (finalStatus !== "granted") {
        console.log(
          "Failed to get push token for push notification permissions not granted!",
        );
        return;
      }

      // Step 4: Get the Expo project ID from app config
      // This is required to generate a push token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.error("Expo project ID not found in app config");
        return;
      }

      // Step 5: Generate the Expo push token for this device
      // This token is unique to this device and app
      token = await Notifications.getExpoPushTokenAsync({ projectId });
    } catch (error) {
      console.error("Error getting push token:", error);
      return;
    }

    // Step 6: Create a notification channel for Android
    // Android requires notification channels to be configured
    // This creates a "default" channel with high importance
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // Step 7: Save the push token to the backend
    // This allows the server to send notifications to this device
    // Only save if user exists and token has changed
    if (user?.email && token?.data) {
      if (user.expoPushToken !== token.data) {
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
    }

    return token;
  }

  // 🔹 Run setup
  // This effect runs on mount and whenever the user changes
  useEffect(() => {
    // Step 1: Register for push notifications and get the token
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    // Step 2: Set up a listener for incoming notifications
    // This fires whenever a notification is received while the app is open
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notif) => {
        setNotification(notif);
      });

    // Step 3: Set up a listener for user interaction with notifications
    // This fires when the user taps on a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User interacted with notification:", response);
      });

    // Step 4: Clean up listeners when the component unmounts
    // This prevents memory leaks and duplicate listeners
    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [user]);

  // Return the current push token and notification to consumers
  return {
    expoPushToken,
    notification,
  };
};
