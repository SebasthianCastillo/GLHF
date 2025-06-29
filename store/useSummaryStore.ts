import { create } from "zustand";

interface SummaryState {
  productDetailSummaryAdd: number;
  productDetailSummaryMinus: number;
  setProductDetailSummaryAdd: (value: number) => void;
  setProductDetailSummaryMinus: (value: number) => void;
}

export const useSummaryStore = create<SummaryState>((set) => ({
  productDetailSummaryAdd: 0,
  productDetailSummaryMinus: 0,
  setProductDetailSummaryAdd: (value) =>
    set({ productDetailSummaryAdd: value }),
  setProductDetailSummaryMinus: (value) =>
    set({ productDetailSummaryMinus: value }),
}));
