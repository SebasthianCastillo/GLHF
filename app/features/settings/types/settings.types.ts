export interface SettingItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: "navigation" | "toggle" | "info" | "toggleMainScreen";
  value?: boolean;
  description?: string;
  badge?: string;
}

export interface SettingSection {
  title: string;
  items: SettingItem[];
}
