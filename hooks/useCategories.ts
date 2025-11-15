import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "../app/api/categories";
import { useUserStore } from "../store/useUserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;
export const useCategories = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  const getCategory = useQuery({
    queryKey: ["categories", user?.email],
    queryFn: getCategories,
    refetchOnMount: false, // Don’t re-fetch unless stale
    retry: 1,
    enabled: !!user,
  });

  const addCategory = useMutation({
    mutationFn: (name: string) => HandleRegister(name),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["categories", user?.email],
      }),
    onSettled: (data, error, variables, context) => {
      // Always run this after the mutation, success or fail
      queryClient.invalidateQueries({
        queryKey: ["categories", user?.email],
      });
    },
  });
  const HandleRegister = async (name: string) => {
    const categoriesData = {
      Name: name,
    };
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    axios
      .post(`${API_URL}/addCategory`, categoriesData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      .catch((error) => {
        console.log("Error adding category", error);
      });
  };

  return { getCategory, addCategory };
};
