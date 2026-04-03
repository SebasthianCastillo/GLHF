import { useQuery } from "@tanstack/react-query";
import { fetchAllProductsMovements, type ProductMovement } from "../app/api/products";
import type { MonthYear } from "../store/useMonthSelectionStore";

export const useProductMovementsByMonths = (
  categoryId: string,
  selectedMonths: MonthYear[]
): {
  data: ProductMovement[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
} => {
  // Query que carga todos los movimientos una sola vez
  const { data: allProducts, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["allProductsMovements", categoryId],
    queryFn: () => fetchAllProductsMovements(categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!categoryId,
  });

  // Filtrar y sumar en memoria basado en meses seleccionados
  const filteredData = (): ProductMovement[] => {
    if (!allProducts || selectedMonths.length === 0) {
      return [];
    }

    const productsMap = new Map<string, ProductMovement>();

    allProducts.forEach((product) => {
      let totalAdded = 0;
      let totalRemoved = 0;
      const allMovements: ProductMovement["movements"] = [];

      product.movements.forEach((mov) => {
        const movDate = new Date(mov.date);
        const movMonth = movDate.getMonth();
        const movYear = movDate.getFullYear();

        // Check if this movement is in any of the selected months
        const isInSelectedMonth = selectedMonths.some(
          (m) => m.month === movMonth && m.year === movYear
        );

        if (isInSelectedMonth) {
          if (mov.operation === "add") {
            totalAdded += mov.quantity;
          } else {
            totalRemoved += mov.quantity;
          }
          allMovements.push(mov);
        }
      });

      // Only include products that have movements in selected months
      if (totalAdded > 0 || totalRemoved > 0) {
        productsMap.set(product.productId, {
          productId: product.productId,
          productName: product.productName,
          added: totalAdded,
          removed: totalRemoved,
          movements: allMovements,
        });
      }
    });

    return Array.from(productsMap.values());
  };

  return {
    data: filteredData(),
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};