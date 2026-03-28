import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export interface Expense {
  id: number;
  amount: number;
  date: string;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "PARTIAL";
  categoryId: number;
  userId: number;
  description: string | null;
  categoryName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFilters {
  fromDate?: string | null;
  toDate?: string | null;
  categoryId?: string | number | null;
  status?: "PENDING" | "PAID" | "OVERDUE" | "PARTIAL" | null;
}

export const getExpenses = async (
  filters?: ExpenseFilters,
): Promise<Expense[]> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const params = new URLSearchParams();
  if (filters?.fromDate) params.append("fromDate", filters.fromDate);
  if (filters?.toDate) params.append("toDate", filters.toDate);
  if (filters?.categoryId)
    params.append("categoryId", String(filters.categoryId));
  if (filters?.status) params.append("status", filters.status);

  const { data } = await axios.get(`${API_URL}/expenses`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return data;
};

export const createExpense = async (expenseData: {
  amount: number;
  date: string;
  dueDate: string;
  categoryId: number;
  description?: string;
}) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const { data } = await axios.post(`${API_URL}/CreateExpense`, expenseData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export interface Payment {
  id: number;
  expenseId: number;
  amount: number;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
}

export const payExpense = async (
  expenseId: number,
  amount: number
): Promise<Payment> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const { data } = await axios.post(
    `${API_URL}/expenses/${expenseId}/pay`,
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
};
