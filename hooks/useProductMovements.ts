import { useQuery } from "@tanstack/react-query";
import { fetchProductsMovementsByDate, type ProductMovement } from "../app/api/products";

export const useProductMovements = (
  categoryId: string, 
  date: string
): {
  data: ProductMovement[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
} => {
  const query = useQuery({
    queryKey: ["productMovements", categoryId, date],
    queryFn: () => fetchProductsMovementsByDate(categoryId, date),
    staleTime: 0, // Sin cache - siempre fetchea datos frescos
    refetchOnWindowFocus: true, // Re-carga cuando vuelve a la pantalla
    refetchOnMount: true, // Siempre refetchea al montar
    enabled: !!categoryId && !!date,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
};
