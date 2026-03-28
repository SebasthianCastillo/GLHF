import { create } from "zustand";
interface User {
  email: string;
  name: String;
  avatar: String;
  authProviders: [
    {
      provider: {
        type: String;
        enum: ["google", "github", "local"];
        required: true;
      };
      providerId: String;
    }
  ];
  settings: {
    // reminderSettings (flattened)
    reminderEnabled: boolean;
    reminderIntervalDays: number;
    reminderLowStockThreshold: number;
    // stockValueSettings (flattened)
    stockValueEnabled: boolean;
  };
  passwordHash: String; // For local auth
  expoPushToken: String;
}
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUserSettingsContext: <T extends object>(newSetting: Partial<T>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  updateUserSettingsContext: (newSetting) =>
    set((state) => {
      if (!state.user) return state;
      
      // Flat structure - directly merge the settings
      return {
        user: {
          ...state.user,
          settings: {
            ...state.user.settings,
            ...newSetting,
          },
        },
      };
    }),
}));
