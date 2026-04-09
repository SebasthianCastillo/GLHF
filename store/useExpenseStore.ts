import { create } from 'zustand';
import { Expense, ExpenseFilters } from '../app/api/expenses';

interface ExpenseStore {
  filters: ExpenseFilters;
  selectedExpense: Expense | null;
  setFilters: (filters: ExpenseFilters) => void;
  clearFilters: () => void;
  setSelectedExpense: (expense: Expense | null) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  filters: {
    fromDate: null,
    toDate: null,
    categoryId: null,
    expenseCategoryId: null,
    status: null,
  },
  selectedExpense: null,
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () =>
    set({
      filters: {
        fromDate: null,
        toDate: null,
        categoryId: null,
        expenseCategoryId: null,
        status: null,
      },
    }),
  setSelectedExpense: (expense) => set({ selectedExpense: expense }),
}));
