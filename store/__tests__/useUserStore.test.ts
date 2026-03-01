import { useUserStore } from "../useUserStore";

describe("useUserStore", () => {
  beforeEach(() => {
    useUserStore.setState({ user: null });
  });

  const mockUser: any = {
    email: "test@example.com",
    name: "Test User",
    avatar: "avatar.png",
    authProviders: [
      { provider: { type: "google", required: true }, providerId: "123" },
    ],
    settings: {
      reminderSettings: {
        enabled: true,
        intervalDays: 7,
        lowStockThreshold: 5,
      },
    },
    passwordHash: "hash123",
    expoPushToken: "token123",
  };

  it("should have null user initially", () => {
    expect(useUserStore.getState().user).toBeNull();
  });

  it("should set user correctly", () => {
    useUserStore.getState().setUser(mockUser);
    expect(useUserStore.getState().user).toEqual(mockUser);
  });

  it("should clear user correctly", () => {
    useUserStore.getState().setUser(mockUser);
    useUserStore.getState().clearUser();
    expect(useUserStore.getState().user).toBeNull();
  });

  it("should update user settings when user exists", () => {
    useUserStore.getState().setUser(mockUser);
    useUserStore.getState().updateUserSettingsContext({ enabled: false });
    const state = useUserStore.getState();
    expect(state.user?.settings.reminderSettings.enabled).toBe(false);
    expect(state.user?.settings.reminderSettings.intervalDays).toBe(7);
  });

  it("should not update settings when user is null", () => {
    useUserStore.getState().updateUserSettingsContext({ enabled: false });
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
  });
});
