import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export interface ProductDetail {
  _id: string;
  quantity: number;
  date: Date;
  format: string;
  operation: string;
  ProductID: string;
}

export interface DailySummary {
  date: string;
  dateObj: Date;
  added: number;
  removed: number;
  transactions: ProductDetail[];
}

export const fetchProductDetailsById = async (ProductKey: string) => {
  try {
    const response = await axios.get(`${API_URL}/productDetailByIDProduct`, {
      params: { ProductKey },
    });
    return response.data;
  } catch (error) {
    console.log("error fetching products detail by id data", error);
    throw error;
  }
};

export const fetchMonthlySummaries = async (ProductKey: string) => {
  try {
    const response = await axios.get(`${API_URL}/getMonthlySummaries`, {
      params: { ProductKey },
    });
    return response.data;
  } catch (error) {
    console.log("error fetching monthly summaries data", error);
    throw error;
  }
};

export const fetchSummaryByOperationAdd = async (
  ProductKey: string,
  currentMonth: Date
) => {
  try {
    const response = await axios.get(
      `${API_URL}/productDetailSummaryByOperationAdd`,
      {
        params: {
          ProductKey,
          currentMonth,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error fetching products detail summary data", error);
    throw error;
  }
};

export const fetchSummaryByOperationMinus = async (
  ProductKey: string,
  currentMonth: Date
) => {
  try {
    const response = await axios.get(
      `${API_URL}/productDetailSummaryByOperationMinus`,
      {
        params: {
          ProductKey,
          currentMonth,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error fetching products detail summary data", error);
    throw error;
  }
};

export const groupTransactionsByDay = (transactions: ProductDetail[]) => {
  const groups: Record<
    string,
    {
      date: string;
      dateObj: Date;
      added: number;
      removed: number;
      transactions: ProductDetail[];
    }
  > = {};

  transactions.forEach((item) => {
    const date = new Date(item.date);
    const dateKey = date.toISOString().split("T")[0];

    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dateKey,
        dateObj: date,
        added: 0,
        removed: 0,
        transactions: [],
      };
    }

    if (item.operation === "add") {
      groups[dateKey].added += item.quantity;
    } else {
      groups[dateKey].removed += item.quantity;
    }
    groups[dateKey].transactions.push(item);
  });

  return Object.values(groups).sort(
    (a, b) => b.dateObj.getTime() - a.dateObj.getTime()
  );
};

export const formatMonthYear = (month: number, year?: string) => {
  const months = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];
  return `${months[month]} ${year}`;
};

export type SetSummaryCallbacks = {
  setProductDetailSummaryAdd: (value: number) => void;
  setProductDetailSummaryMinus: (value: number) => void;
};

export const fetchSummaryData = async (
  ProductKey: string,
  currentMonth: Date,
  callbacks: SetSummaryCallbacks
) => {
  try {
    const addResponse = await fetchSummaryByOperationAdd(
      ProductKey,
      currentMonth
    );

    const minusResponse = await fetchSummaryByOperationMinus(
      ProductKey,
      currentMonth
    );

    if (Array.isArray(addResponse) && addResponse.length > 0) {
      callbacks.setProductDetailSummaryAdd(addResponse[0].totalQuantity);
    } else {
      callbacks.setProductDetailSummaryAdd(0);
    }

    if (Array.isArray(minusResponse) && minusResponse.length > 0) {
      callbacks.setProductDetailSummaryMinus(minusResponse[0].totalQuantity);
    } else {
      callbacks.setProductDetailSummaryMinus(0);
    }
  } catch (error) {
    console.log("error fetching products detail summary data", error);
  }
};

export type FilterByMonthCallbacks = {
  setFilteredDetails: (details: ProductDetail[]) => void;
  setDailySummaries: (summaries: DailySummary[]) => void;
} & SetSummaryCallbacks;

export const filterByMonth = (
  data: ProductDetail[],
  month: number,
  year: number,
  productKey: string,
  callbacks: FilterByMonthCallbacks
) => {
  const filtered = data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === month && itemDate.getFullYear() === year;
  });

  callbacks.setFilteredDetails(filtered);
  const daily = groupTransactionsByDay(filtered);
  callbacks.setDailySummaries(daily);

  if (filtered.length > 0) {
    fetchSummaryData(
      productKey,
      new Date(year, month, 1),
      callbacks
    );
  } else {
    callbacks.setProductDetailSummaryAdd(0);
    callbacks.setProductDetailSummaryMinus(0);
  }
};

export const getPreviousMonth = (currentMonth: number, currentYear: number) => {
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  return { month: prevMonth, year: prevYear };
};

export const getNextMonth = (currentMonth: number, currentYear: number) => {
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  return { month: nextMonth, year: nextYear };
};

export const getMonthNames = () => [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
