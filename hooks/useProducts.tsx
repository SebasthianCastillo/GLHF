import { useState, useCallback } from "react";
import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export const useProducts = (categoryId: string) => {
  const [products, setProducts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/productsByIDCategory`, {
        params: { CategoryKey: categoryId },
      });
      setProducts(data);
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
  const updateQuantity = async (id: string, qty: number, operation: string) => {
    try {
      await axios.patch(`${API_URL}/quantityUpdateProduct`, {
        _id: id,
        quantity: qty,
        operation,
      });
      await fetchProducts();
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
      await updateQuantity(id, qty, operation);
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
    products,
    isRefreshing,
    fetchProducts,
    refreshProducts,
    addProductDetail,
    modifyProduct,
    deleteProduct,
  };
};
