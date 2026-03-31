import { useQuery } from "@tanstack/react-query";
import { fetchProductsMovementsByMonth, type ProductMovement } from "../app/api/products";

export const useProductMovementsByMonth = (
  categoryId: string, 
  month: number,
  year: number
): {
  data: ProductMovement[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
} => {
  const query = useQuery({
    queryKey: ["productMovementsByMonth", categoryId, month, year],
    queryFn: () => fetchProductsMovementsByMonth(categoryId, month, year),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !!categoryId && month >= 0 && year > 0,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
};
