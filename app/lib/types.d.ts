export type AggregationResult = {
  years: number[];
  dataByYear: Record<
    string,
    {
      year: number;
      month: number;
      added: number;
      removed: number;
      monthName: string;
    }[]
  >;
};
