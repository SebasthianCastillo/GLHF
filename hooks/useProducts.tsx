import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts as apiFetchProducts,
  registerProduct,
  updateQuantity,
  modifyProduct,
  deleteProduct,
  updateProductCost as apiUpdateProductCost,
} from "../app/api/products";
export const useProducts = (categoryId: string) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const updateQuantityProduct = useMutation({
    mutationFn: ({
      id,
      qty,
      format,
      operation,
      cost,
    }: {
      id: string;
      qty: number;
      format: string;
      operation: string;
      cost?: number;
    }) => updateQuantity(id, qty, format, operation, cost),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["getProducts", categoryId],
      }),
    onMutate: async (productData) => {
      await queryClient.cancelQueries({
        queryKey: ["getProducts", categoryId],
      });

      const previousProducts = queryClient.getQueryData<any>([
        "getProducts",
        categoryId,
      ]);
      queryClient.setQueryData(["getProducts", categoryId], (old: any) => {
        if (!old) return old;
        const sign = productData.operation === "add" ? 1 : -1;
        const product = old.find(
          (product: any) => product._id === productData.id,
        );
        if (!product) {
          return old;
        }
        product.quantity = product.quantity + sign * productData.qty;
        if (productData.operation === "add" && productData.cost) {
          product.totalSpent = (product.totalSpent || 0) + productData.qty * productData.cost;
          product.cost = productData.cost;
        }
        return old;
      });

      return previousProducts;
    },
    onError: (
      err,
      product: { id: string; qty: number; format: string; operation: string },
      context,
    ) => {
      if (context?.previousProducts)
        queryClient.setQueryData(
          ["getProducts", categoryId],
          context?.previousProducts,
        );
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["getProducts", categoryId],
      });
    },
  });
  const productsQuery = useQuery({
    queryKey: ["getProducts", categoryId],
    queryFn: () => apiFetchProducts(categoryId),
  });
  // Mutation Function for adding a product
  const addProduct = useMutation({
    mutationFn: ({
      ProductName,
      quantityProduct,
      CategoryKey,
    }: {
      ProductName: string;
      quantityProduct: number;
      CategoryKey: string;
    }) => registerProduct(ProductName, quantityProduct, CategoryKey),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["getProducts", categoryId],
        refetchType: "inactive",
      }),

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["getProducts", categoryId],
      });
    },
  });

  const refreshProducts = useCallback(async () => {
    setIsRefreshing(true);
    await apiFetchProducts(categoryId);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [categoryId]);

  const updateProductCostMutation = useMutation({
    mutationFn: ({ id, cost }: { id: string; cost: number }) => 
      apiUpdateProductCost(id, cost),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getProducts", categoryId],
      });
    },
  });

  return {
    productsQuery,
    isRefreshing,
    fetchProducts: apiFetchProducts,
    refreshProducts,
    updateQuantityProduct,
    addProduct,
    modifyProduct,
    deleteProduct,
    updateProductCost: updateProductCostMutation,
  };
};
