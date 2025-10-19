import { create } from "zustand";
interface User {
  email: { type: String; required: true; unique: true };
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
  passwordHash: String; // For local auth
  expoPushToken: String;
}
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
