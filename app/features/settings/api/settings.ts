import axios from "axios";
import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL;
export const updateUserSettings = async <T extends Record<string, any>>(
  group: string,
  userEmail: string,
  updates: Partial<T>,
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/updateUserSettings`, {
      group,
      userEmail: userEmail,
      ...updates,
    });
  } catch (err) {
    console.error(err);
  }
};
