import axios from "axios";
import Constants from "expo-constants";
import { fetchProductDetailsById } from "./productDetail";

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
  CategoryKey: string,
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
  cost?: number,
) => {
  try {
    await axios.patch(`${API_URL}/quantityUpdateProduct`, {
      id: id,
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
  cost?: number,
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

export interface ProductMovement {
  productId: string;
  productName: string;
  added: number;
  removed: number;
  movements: Array<{
    id: string;
    quantity: number;
    format: string;
    operation: string;
    date: string;
  }>;
}

interface ProductDetailResponse {
  id: string;
  quantity: number;
  date: string;
  format: string;
  operation: string;
  ProductID: string;
  Product?: {
    id: string;
    Name: string;
  };
}

interface ProductItem {
  id: string;
  Name: string;
}

export const filterMovementsByDate = (
  movements: ProductDetailResponse[],
  date: string,
): ProductDetailResponse[] => {
  return movements.filter((movement) => {
    // Usar formato local para evitar problemas de timezone
    const movementDateObj = new Date(movement.date);
    const movementDate = `${movementDateObj.getFullYear()}-${String(movementDateObj.getMonth() + 1).padStart(2, "0")}-${String(movementDateObj.getDate()).padStart(2, "0")}`;
    return movementDate === date;
  });
};

export const fetchProductsMovementsByDate = async (
  categoryId: string,
  date: string,
): Promise<ProductMovement[]> => {
  try {
    const products = await fetchProducts(categoryId);
    
    if (!products || !Array.isArray(products)) {
      return [];
    }

    const movementsByProduct = await Promise.all(
      products.map(async (product: any) => {
        const details = await fetchProductDetailsById(product.id);
        
        // Manejar diferentes nombres de propiedad para el nombre del producto
        const productName = product.Name || product.name || product.ProductName || "Sin nombre";
        const productId = product.id || product.ProductID;
        
        if (!details || !Array.isArray(details)) {
          return {
            productId,
            productName,
            added: 0,
            removed: 0,
            movements: [],
          };
        }

        const filteredMovements = filterMovementsByDate(details, date);

        let added = 0;
        let removed = 0;
        const movements = filteredMovements.map((m) => {
          if (m.operation === "add") {
            added += m.quantity;
          } else {
            removed += m.quantity;
          }
          return {
            id: m.id,
            quantity: m.quantity,
            format: m.format,
            operation: m.operation,
            date: new Date(m.date).toISOString(),
          };
        });

        return {
          productId,
          productName,
          added,
          removed,
          movements,
        };
      }),
    );

    return movementsByProduct;
  } catch (error) {
    console.log("❌ Error fetching products movements by date:", error);
    return [];
  }
};
