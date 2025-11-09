import { create } from "zustand";
export type SelectedValuesType = {
  [key: string]: string;
};

interface SelectedIdProduct {
  selectedProductId: string | null;
  selectedValuesFormatPicker: SelectedValuesType | null;
  setSelectedProductId: (value: string | null) => void;
  setSelectedValuesFormatPicker: (value: SelectedValuesType | null) => void;
}

export const useSelectedValuesFormatPicker = create<SelectedIdProduct>(
  (set) => ({
    selectedProductId: null,
    selectedValuesFormatPicker: null,
    setSelectedProductId: (value) => set({ selectedProductId: value }),
    setSelectedValuesFormatPicker: (value) =>
      set((state) => ({
        selectedValuesFormatPicker: {
          ...state.selectedValuesFormatPicker,
          ...value,
        },
      })),
  })
);
