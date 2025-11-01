import { create } from "zustand";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface SettingItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: "navigation" | "toggle" | "info" | "toggleManScreen";
  value?: boolean;
  description?: string;
  badge?: string;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}
interface SettingState {
  sections: SettingSection[];
}

const sections: SettingSection[] = [
  {
    title: "Notifications",
    items: [
      {
        id: "enabled",
        label: "Enable Notifications",
        icon: "",
        type: "toggleManScreen",
        description: "toggle for enable or disable general notifications",
      },
      {
        id: "NotificationSettingScreen",
        label: "Reminder Notification",
        icon: "",
        type: "navigation",
        description: "Manage your notification reminder settings",
      },
    ],
  },
];
export const useSettingStore = create<SettingState>(() => ({
  sections: sections,
}));
