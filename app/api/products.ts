import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export interface ProductData {
  id: string;
  qty: number;
  format: string;
  operation: string;
  cost?: number;
}

export const registerProduct = async (
  ProductName: string,
  quantityProduct: number,
  CategoryKey: string
) => {
  try {
    const ProductData = {
      Name: ProductName,
      quantity: quantityProduct,
      CategoryID: CategoryKey,
    };
    return axios.post(`${API_URL}/addProduct`, ProductData);
  } catch (error) {
    console.log("Error adding product", error);
  }
};

export const fetchProducts = async (categoryId: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/productsByIDCategory`, {
      params: { CategoryKey: categoryId },
    });
    console.log("products render");
    return data;
  } catch (e) {
    console.log("❌ Error fetching products:", e);
  }
};

export const updateQuantity = async (
  id: string,
  qty: number,
  format: string,
  operation: string,
  cost?: number
) => {
  try {
    await axios.patch(`${API_URL}/quantityUpdateProduct`, {
      _id: id,
      quantity: qty,
      operation,
      cost,
    });

    await addProductDetail(id, qty, format, operation, cost);
  } catch (err) {
    console.log("❌ Error updating quantity", err);
  }
};

export const addProductDetail = async (
  id: string,
  qty: number,
  format: string,
  operation: string,
  cost?: number
) => {
  try {
    await axios.post(`${API_URL}/addProductDetail`, {
      ProductID: id,
      quantity: qty,
      date: new Date(),
      format,
      operation,
      cost: cost || 0,
    });
  } catch (e) {
    console.log("❌ Error adding detail", e);
  }
};

export const modifyProduct = async (id: string, newName?: string) => {
  await axios.patch(`${API_URL}/updateProductName/${id}`, { newName });
};

export const deleteProduct = async (id: string) => {
  await axios.delete(`${API_URL}/deleteProduct/${id}`);
};

export const updateProductCost = async (id: string, cost: number) => {
  try {
    await axios.patch(`${API_URL}/updateProductCost/${id}`, { cost });
  } catch (err) {
    console.log("❌ Error updating product cost", err);
  }
};
