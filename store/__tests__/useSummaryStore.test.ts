import { useSummaryStore } from "../useSummaryStore";

describe("useSummaryStore", () => {
  beforeEach(() => {
    useSummaryStore.setState({ productDetailSummaryAdd: 0, productDetailSummaryMinus: 0 });
  });

  it("should have initial values of 0", () => {
    const state = useSummaryStore.getState();
    expect(state.productDetailSummaryAdd).toBe(0);
    expect(state.productDetailSummaryMinus).toBe(0);
  });

  it("should set productDetailSummaryAdd correctly", () => {
    useSummaryStore.getState().setProductDetailSummaryAdd(10);
    expect(useSummaryStore.getState().productDetailSummaryAdd).toBe(10);
  });

  it("should set productDetailSummaryMinus correctly", () => {
    useSummaryStore.getState().setProductDetailSummaryMinus(5);
    expect(useSummaryStore.getState().productDetailSummaryMinus).toBe(5);
  });

  it("should handle negative values", () => {
    useSummaryStore.getState().setProductDetailSummaryMinus(-3);
    expect(useSummaryStore.getState().productDetailSummaryMinus).toBe(-3);
  });

  it("should allow independent updates", () => {
    useSummaryStore.getState().setProductDetailSummaryAdd(10);
    useSummaryStore.getState().setProductDetailSummaryMinus(5);
    const state = useSummaryStore.getState();
    expect(state.productDetailSummaryAdd).toBe(10);
    expect(state.productDetailSummaryMinus).toBe(5);
  });
});
