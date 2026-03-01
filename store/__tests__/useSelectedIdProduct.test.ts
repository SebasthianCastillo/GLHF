import { useSelectedValuesFormatPicker } from "../useSelectedIdProduct";

describe("useSelectedValuesFormatPicker", () => {
  beforeEach(() => {
    useSelectedValuesFormatPicker.setState({ selectedProductId: null, selectedValuesFormatPicker: null });
  });

  it("should have initial null values", () => {
    const state = useSelectedValuesFormatPicker.getState();
    expect(state.selectedProductId).toBeNull();
    expect(state.selectedValuesFormatPicker).toBeNull();
  });

  it("should set selectedProductId correctly", () => {
    useSelectedValuesFormatPicker.getState().setSelectedProductId("prod-123");
    expect(useSelectedValuesFormatPicker.getState().selectedProductId).toBe("prod-123");
  });

  it("should set selectedProductId to null", () => {
    useSelectedValuesFormatPicker.getState().setSelectedProductId("prod-123");
    useSelectedValuesFormatPicker.getState().setSelectedProductId(null);
    expect(useSelectedValuesFormatPicker.getState().selectedProductId).toBeNull();
  });

  it("should set selectedValuesFormatPicker correctly", () => {
    useSelectedValuesFormatPicker.getState().setSelectedValuesFormatPicker({ format: "kg" });
    expect(useSelectedValuesFormatPicker.getState().selectedValuesFormatPicker).toEqual({ format: "kg" });
  });

  it("should merge selectedValuesFormatPicker values", () => {
    useSelectedValuesFormatPicker.getState().setSelectedValuesFormatPicker({ format: "kg" });
    useSelectedValuesFormatPicker.getState().setSelectedValuesFormatPicker({ quantity: "5" });
    expect(useSelectedValuesFormatPicker.getState().selectedValuesFormatPicker).toEqual({ format: "kg", quantity: "5" });
  });

  it("should handle independent updates", () => {
    useSelectedValuesFormatPicker.getState().setSelectedProductId("prod-123");
    useSelectedValuesFormatPicker.getState().setSelectedValuesFormatPicker({ format: "pcs" });
    const state = useSelectedValuesFormatPicker.getState();
    expect(state.selectedProductId).toBe("prod-123");
    expect(state.selectedValuesFormatPicker).toEqual({ format: "pcs" });
  });
});
