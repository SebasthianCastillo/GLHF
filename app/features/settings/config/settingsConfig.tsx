import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SettingSection } from "../types/settings.types";
export const sections: SettingSection[] = [
  {
    title: "Notifications",
    items: [
      {
        id: "enabled",
        label: "Enable Notifications",
        icon: "",
        type: "toggleMainScreen",
        description: "toggle for enable or disable general notifications",
      },
      {
        id: "NotificationSettingScreen",
        label: "Reminder Notification",
        icon: <FontAwesome6 name="bell" size={24} color="white" />,
        type: "navigation",
        description: "Manage your notification reminder settings",
      },
    ],
  },
];
