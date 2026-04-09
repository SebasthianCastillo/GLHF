import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
  ExpenseCategory,
} from "../app/api/expense-categories";
import { useUserStore } from "../store/useUserStore";

export const useExpenseCategories = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  // Query: get all expense categories
  const getCategory = useQuery({
    queryKey: ["expenseCategories", user?.email],
    queryFn: getExpenseCategories,
    refetchOnMount: false,
    retry: 1,
    enabled: !!user,
  });

  // Mutation: create category
  const addCategory = useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId?: number | null }) =>
      createExpenseCategory({ name, parentId }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["expenseCategories", user?.email],
      }),
  });

  // Mutation: update category
  const updateCategory = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateExpenseCategory(id, { name }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["expenseCategories", user?.email],
      }),
  });

  // Mutation: delete category
  const removeCategory = useMutation({
    mutationFn: (id: number) => deleteExpenseCategory(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["expenseCategories", user?.email],
      }),
  });

  return {
    getCategory,
    categories: getCategory.data || [],
    isLoading: getCategory.isLoading,
    isError: getCategory.isError,
    addCategory,
    updateCategory,
    removeCategory,
  };
};