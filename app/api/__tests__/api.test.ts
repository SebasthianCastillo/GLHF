import axios from "axios";

jest.mock("expo-constants", () => ({
  expoConfig: { extra: { API_URL: "http://localhost:3000" } },
  extra: { API_URL: "http://localhost:3000" },
}));

const mockAxiosPost = jest.spyOn(axios, "post");
const mockAxiosGet = jest.spyOn(axios, "get");
const mockAxiosPatch = jest.spyOn(axios, "patch");
const mockAxiosDelete = jest.spyOn(axios, "delete");

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

import { registerProduct, fetchProducts, updateQuantity, modifyProduct, deleteProduct } from "../products";
import { getCategories } from "../categories";

describe("products API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosPost.mockResolvedValue({});
    mockAxiosGet.mockResolvedValue({ data: [] });
    mockAxiosPatch.mockResolvedValue({});
    mockAxiosDelete.mockResolvedValue({});
  });

  describe("registerProduct", () => {
    it("should call API with correct data", async () => {
      mockAxiosPost.mockResolvedValueOnce({ data: { success: true } });
      await registerProduct("Test Product", 10, "cat-123");
      expect(mockAxiosPost).toHaveBeenCalledWith(
        "http://localhost:3000/addProduct",
        { Name: "Test Product", quantity: 10, CategoryID: "cat-123" }
      );
    });
  });

  describe("fetchProducts", () => {
    it("should fetch products by category", async () => {
      const mockProducts = [{ id: "1", name: "Product 1" }];
      mockAxiosGet.mockResolvedValueOnce({ data: mockProducts });
      const result = await fetchProducts("cat-123");
      expect(mockAxiosGet).toHaveBeenCalledWith(
        "http://localhost:3000/productsByIDCategory",
        { params: { CategoryKey: "cat-123" } }
      );
      expect(result).toEqual(mockProducts);
    });
  });

  describe("updateQuantity", () => {
    it("should update quantity and add detail", async () => {
      mockAxiosPatch.mockResolvedValueOnce({});
      mockAxiosPost.mockResolvedValueOnce({});
      await updateQuantity("prod-1", 5, "kg", "add");
      expect(mockAxiosPatch).toHaveBeenCalledWith(
        "http://localhost:3000/quantityUpdateProduct",
        { _id: "prod-1", quantity: 5, operation: "add" }
      );
      expect(mockAxiosPost).toHaveBeenCalledWith(
        "http://localhost:3000/addProductDetail",
        expect.objectContaining({
          ProductID: "prod-1",
          quantity: 5,
          format: "kg",
          operation: "add",
        })
      );
    });
  });

  describe("modifyProduct", () => {
    it("should call update API with new name", async () => {
      await modifyProduct("prod-1", "New Name");
      expect(mockAxiosPatch).toHaveBeenCalledWith(
        "http://localhost:3000/updateProductName/prod-1",
        { newName: "New Name" }
      );
    });
  });

  describe("deleteProduct", () => {
    it("should call delete API", async () => {
      await deleteProduct("prod-1");
      expect(mockAxiosDelete).toHaveBeenCalledWith(
        "http://localhost:3000/deleteProduct/prod-1"
      );
    });
  });
});

describe("categories API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosGet.mockResolvedValue({ data: [] });
  });

  describe("getCategories", () => {
    it("should fetch categories with token", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");
      AsyncStorage.getItem.mockResolvedValueOnce("mock-token");
      const mockCategories = [{ id: "1", name: "Category 1" }];
      mockAxiosGet.mockResolvedValueOnce({ data: mockCategories });
      
      const result = await getCategories();
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("token");
      expect(mockAxiosGet).toHaveBeenCalledWith(
        "http://localhost:3000/categories",
        { headers: { Authorization: "Bearer mock-token" } }
      );
      expect(result).toEqual(mockCategories);
    });

    it("should throw error when no token", async () => {
      const AsyncStorage = require("@react-native-async-storage/async-storage");
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      
      await expect(getCategories()).rejects.toThrow("No token found");
    });
  });
});
