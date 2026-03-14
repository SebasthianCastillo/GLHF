import { create } from "zustand";
interface User {
  email: string;
  name: string;
  avatar: string;
  authProviders: [
    {
      provider: {
        type: string;
        enum: ["google", "github", "local"];
        required: true;
      };
      providerId: string;
    }
  ];
  settings: {
    reminderSettings: {
      enabled: boolean;
      intervalDays: { type: number; default: 7 };
      lowStockThreshold: { type: number; default: 5 };
    };
    stockValueSettings: {
      enabled: boolean;
    };
  };
  passwordHash: string;
  expoPushToken: string;
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
      
      const settingKey = Object.keys(newSetting)[0];
      const settingValue = Object.values(newSetting)[0];
      
      if (settingKey === 'enabled' && 'stockValueSettings' in state.user.settings) {
        return {
          user: {
            ...state.user,
            settings: {
              ...state.user.settings,
              stockValueSettings: {
                enabled: settingValue as boolean,
              },
            },
          },
        };
      }
      
      return {
        user: {
          ...state.user,
          settings: {
            ...state.user.settings,
            reminderSettings: {
              ...state.user.settings.reminderSettings,
              ...newSetting,
            },
          },
        },
      };
    }),
}));
