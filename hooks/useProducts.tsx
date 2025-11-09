import { useState, useCallback } from "react";
import axios from "axios";
import Constants from "expo-constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = Constants.expoConfig?.extra?.API_URL;
interface productData {
  id: string;
  qty: number;
  format: string;
  operation: string;
}
export const useProducts = (categoryId: string) => {
  const [products, setProducts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const updateQuantityProduct = () => {
    return useMutation({
      mutationFn: ({ id, qty, format, operation }: productData) =>
        updateQuantity(id, qty, format, operation),
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
            (product: any) => product._id === productData.id
          );
          if (!product) {
            return old;
          }
          product.quantity = product.quantity + sign * productData.qty;
          return old;
        });

        return previousProducts;
      },
      onError: (err, product: productData, context) => {
        if (context?.previousProducts)
          queryClient.setQueryData(
            ["getProducts", categoryId],
            context?.previousProducts
          );
      },
      onSettled: (data, error, variables, context) => {
        // Always run this after the mutation, success or fail
        queryClient.invalidateQueries({
          queryKey: ["getProducts", categoryId],
        });
      },
    });
  };

  const getProducts = () => {
    return useQuery({
      queryKey: ["getProducts", categoryId],
      queryFn: () => fetchProducts(),
    });
  };
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/productsByIDCategory`, {
        params: { CategoryKey: categoryId },
      });
      return data;
      // setProducts(data);
    } catch (e) {
      console.log("❌ Error fetching products:", e);
    }
  }, [categoryId]);

  const refreshProducts = useCallback(async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [fetchProducts]);

  //Funcion para actualizar cantidad de producto
  const updateQuantity = async (
    id: string,
    qty: number,
    format: string,
    operation: string
  ) => {
    try {
      await axios.patch(`${API_URL}/quantityUpdateProduct`, {
        _id: id,
        quantity: qty,
        operation,
      });

      await addProductDetail(id, qty, format, operation);
    } catch (err) {
      console.log("❌ Error updating quantity", err);
    }
  };

  const addProductDetail = async (
    id: string,
    qty: number,
    format: string,
    operation: string
  ) => {
    try {
      await axios.post(`${API_URL}/addProductDetail`, {
        ProductID: id,
        quantity: qty,
        date: new Date(),
        format,
        operation,
      });
    } catch (e) {
      console.log("❌ Error adding detail", e);
    }
  };

  const modifyProduct = async (id: string, newName?: string) => {
    await axios.patch(`${API_URL}/updateProductName/${id}`, { newName });
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await axios.delete(`${API_URL}/deleteProduct/${id}`);
    await fetchProducts();
  };

  return {
    getProducts,
    isRefreshing,
    fetchProducts,
    refreshProducts,
    updateQuantityProduct,
    modifyProduct,
    deleteProduct,
  };
};
