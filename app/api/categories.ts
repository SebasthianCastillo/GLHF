import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export const getCategories = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");
  console.log("categories render");
  const { data } = await axios.get(`${API_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};
