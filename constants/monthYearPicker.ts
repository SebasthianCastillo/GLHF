/**
 * Configuration for MonthYearPicker component
 * Centralized config for consistent year range behavior across the app
 */

export const MONTH_YEAR_PICKER_CONFIG = {
  /** Number of years to show before current year */
  yearsBack: 10,
  /** Number of years to show after current year */
  yearsForward: 2,
};

/** Type for the picker configuration */
export type MonthYearPickerConfig = {
  yearsBack: number;
  yearsForward: number;
};

/**
 * Helper to create custom config with overrides
 * @example
 * const customConfig = createMonthYearPickerConfig({ yearsBack: 20 })
 */
export const createMonthYearPickerConfig = (
  overrides?: Partial<MonthYearPickerConfig>
): MonthYearPickerConfig => ({
  yearsBack: MONTH_YEAR_PICKER_CONFIG.yearsBack,
  yearsForward: MONTH_YEAR_PICKER_CONFIG.yearsForward,
  ...overrides,
});

/**
 * Helper to calculate actual min/max years based on config
 * @example
 * const { minYear, maxYear } = getMonthYearPickerRange(MONTH_YEAR_PICKER_CONFIG)
 */
export const getMonthYearPickerRange = (config: MonthYearPickerConfig) => {
  const currentYear = new Date().getFullYear();
  return {
    minYear: currentYear - config.yearsBack,
    maxYear: currentYear + config.yearsForward,
  };
};
