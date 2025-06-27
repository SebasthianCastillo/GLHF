import { create } from 'zustand';

// Define the state structure and the actions
interface SummaryState {
  productDetailSummaryAdd: number;
  productDetailSummaryMinus: number;
  setProductDetailSummaryAdd: (value: number) => void;
  setProductDetailSummaryMinus: (value: number) => void;
}

// Create the store
export const useSummaryStore = create<SummaryState>((set) => ({
  productDetailSummaryAdd: 0,
  productDetailSummaryMinus: 0,
  setProductDetailSummaryAdd: (value) => set({ productDetailSummaryAdd: value }),
  setProductDetailSummaryMinus: (value) => set({ productDetailSummaryMinus: value }),
}));
