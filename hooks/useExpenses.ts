import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getExpenses, createExpense, ExpenseFilters, Expense } from '../app/api/expenses';
import { useExpenseStore } from '../store/useExpenseStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem('token');
};

export const useExpenses = () => {
  const queryClient = useQueryClient();
  const { filters } = useExpenseStore();

  const expensesQuery = useQuery({
    queryKey: ['expenses', filters],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token found');
      return getExpenses(filters);
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });

  const createExpenseMutation = useMutation({
    mutationFn: (data: {
      amount: number;
      date: string;
      dueDate: string;
      categoryId: number;
      description?: string;
    }) => createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const refetchExpenses = () => {
    queryClient.invalidateQueries({ queryKey: ['expenses'] });
  };

  return {
    expenses: expensesQuery.data as Expense[] | undefined,
    isLoading: expensesQuery.isLoading,
    isError: expensesQuery.isError,
    error: expensesQuery.error,
    createExpense: createExpenseMutation.mutate,
    createExpenseAsync: createExpenseMutation.mutateAsync,
    isCreating: createExpenseMutation.isPending,
    refetchExpenses,
  };
};
