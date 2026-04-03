import { create } from "zustand";

export interface MonthYear {
  month: number;
  year: number;
}

interface Movement {
  id: string;
  quantity: number;
  format: string;
  operation: string;
  date: string;
}

interface ProductMovement {
  productId: string;
  productName: string;
  added: number;
  removed: number;
  movements: Movement[];
}

interface MonthSelectionStore {
  // Estado
  selectedMonths: MonthYear[];
  currentYear: number;
  
  // Actions
  setCurrentYear: (year: number) => void;
  toggleMonth: (month: number, year: number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isSelected: (month: number, year: number) => boolean;
  getSelectedCount: () => number;
  
  // Getters
  getSelectedMonths: () => MonthYear[];
  getDisplayText: () => string;
}

const MONTHS = [
  { label: "ENE", value: 0 },
  { label: "FEB", value: 1 },
  { label: "MAR", value: 2 },
  { label: "ABR", value: 3 },
  { label: "MAY", value: 4 },
  { label: "JUN", value: 5 },
  { label: "JUL", value: 6 },
  { label: "AGO", value: 7 },
  { label: "SEP", value: 8 },
  { label: "OCT", value: 9 },
  { label: "NOV", value: 10 },
  { label: "DIC", value: 11 },
];

export const useMonthSelectionStore = create<MonthSelectionStore>((set, get) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return {
    selectedMonths: [{ month: currentMonth, year: currentYear }],
    currentYear: currentYear,

    setCurrentYear: (year: number) => {
      set({ currentYear: year });
    },

    toggleMonth: (month: number, year: number) => {
      const { selectedMonths } = get();
      const exists = selectedMonths.some(
        m => m.month === month && m.year === year
      );
      
      if (exists) {
        set({
          selectedMonths: selectedMonths.filter(
            m => !(m.month === month && m.year === year)
          ),
        });
      } else {
        set({
          selectedMonths: [...selectedMonths, { month, year }],
        });
      }
    },

    selectAll: () => {
      const { currentYear } = get();
      const allMonths = MONTHS.map(m => ({ month: m.value, year: currentYear }));
      set({ selectedMonths: allMonths });
    },

    clearSelection: () => {
      set({ selectedMonths: [] });
    },

    isSelected: (month: number, year: number) => {
      const { selectedMonths } = get();
      return selectedMonths.some(m => m.month === month && m.year === year);
    },

    getSelectedCount: () => {
      return get().selectedMonths.length;
    },

    getSelectedMonths: () => {
      return get().selectedMonths;
    },

    getDisplayText: () => {
      const { selectedMonths, currentYear } = get();
      
      if (selectedMonths.length === 0) {
        return "Seleccionar meses";
      }

      if (selectedMonths.length === 1) {
        const m = selectedMonths[0];
        const monthName = MONTHS.find(month => month.value === m.month)?.label || "";
        return `${monthName} ${m.year}`;
      }

      // Sort by month and year
      const sorted = [...selectedMonths].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

      // Get unique years
      const years = [...new Set(sorted.map(m => m.year))];
      
      // If all same year and consecutive months
      const isConsecutive = sorted.every((m, i) => {
        if (i === 0) return true;
        const prev = sorted[i - 1];
        if (m.year !== prev.year) return true;
        return m.month === prev.month + 1;
      });

      if (years.length === 1 && isConsecutive) {
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const firstName = MONTHS.find(m => m.value === first.month)?.label || "";
        const lastName = MONTHS.find(m => m.value === last.month)?.label || "";
        return `${firstName} - ${lastName} ${first.year}`;
      }

      // Otherwise show comma-separated
      const monthLabels = sorted.map(m => {
        const monthName = MONTHS.find(month => month.value === m.month)?.label || "";
        return `${monthName}`;
      });

      return `${monthLabels.join(", ")} ${years.length > 1 ? years.join(", ") : years[0]}`;
    },
  };
});

// Helper para calcular suma de productos seleccionados
export const getProductsSummaryByMonths = (
  products: ProductMovement[],
  selectedMonths: MonthYear[]
): ProductMovement[] => {
  if (selectedMonths.length === 0) return [];
  
  // Agrupar productos por productId
  const productsMap = new Map<string, ProductMovement>();
  
  selectedMonths.forEach(({ month, year }) => {
    const monthData = products.find((p: ProductMovement) => 
      p.movements.some((mov: Movement) => {
        const movDate = new Date(mov.date);
        return movDate.getMonth() === month && movDate.getFullYear() === year;
      })
    );
    
    if (monthData) {
      // Calcular movimientos del mes específico
      const monthMovements = monthData.movements.filter((mov: Movement) => {
        const movDate = new Date(mov.date);
        return movDate.getMonth() === month && movDate.getFullYear() === year;
      });
      
      const added = monthMovements
        .filter((m: Movement) => m.operation === "add")
        .reduce((sum: number, m: Movement) => sum + m.quantity, 0);
        
      const removed = monthMovements
        .filter((m: Movement) => m.operation !== "add")
        .reduce((sum: number, m: Movement) => sum + m.quantity, 0);
      
      if (productsMap.has(monthData.productId)) {
        const existing = productsMap.get(monthData.productId)!;
        existing.added += added;
        existing.removed += removed;
        existing.movements.push(...monthMovements);
      } else {
        productsMap.set(monthData.productId, {
          productId: monthData.productId,
          productName: monthData.productName,
          added,
          removed,
          movements: monthMovements,
        });
      }
    }
  });
  
  return Array.from(productsMap.values());
};
