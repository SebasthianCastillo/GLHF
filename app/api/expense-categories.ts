import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export interface ExpenseCategory {
  id: number;
  name: string;
  parentId: number | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  children?: ExpenseCategory[];
}

export const getExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const { data } = await axios.get(`${API_URL}/expense-categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getExpenseCategoryById = async (id: number): Promise<ExpenseCategory> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const { data } = await axios.get(`${API_URL}/expense-categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const createExpenseCategory = async (categoryData: {
  name: string;
  parentId?: number | null;
}): Promise<ExpenseCategory> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const { data } = await axios.post(`${API_URL}/expense-categories`, categoryData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateExpenseCategory = async (
  id: number,
  categoryData: { name: string }
): Promise<ExpenseCategory> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const { data } = await axios.put(`${API_URL}/expense-categories/${id}`, categoryData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const deleteExpenseCategory = async (id: number): Promise<void> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  await axios.delete(`${API_URL}/expense-categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Helper to flatten categories for picker
export const flattenExpenseCategories = (categories: ExpenseCategory[]): ExpenseCategory[] => {
  const result: ExpenseCategory[] = [];
  
  const flatten = (cats: ExpenseCategory[], level: number = 0) => {
    cats.forEach((cat) => {
      result.push({
        ...cat,
        name: level > 0 ? `  └ ${cat.name}` : cat.name, // Indent subcategories
      });
      if (cat.children && cat.children.length > 0) {
        flatten(cat.children, level + 1);
      }
    });
  };
  
  flatten(categories);
  return result;
};

// Helper to get all category IDs including children (for filtering)
export const getCategoryAndChildrenIds = (category: ExpenseCategory): number[] => {
  const ids = [category.id];
  if (category.children) {
    category.children.forEach((child) => {
      ids.push(...getCategoryAndChildrenIds(child));
    });
  }
  return ids;
};