import prisma from '../lib/prisma.mjs';

export const getDateRange = (currentMonth) => {
  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
    23, 59, 59, 999
  );
  return { startOfMonth, endOfMonth };
};

export const getMonthlySummaries = async (productId) => {
  const result = await prisma.$queryRaw`
    WITH monthly_data AS (
      SELECT
        EXTRACT(YEAR FROM date)::int as year,
        EXTRACT(MONTH FROM date)::int as month,
        SUM(CASE WHEN LOWER(operation) = 'add' THEN quantity ELSE 0 END)::int as added,
        SUM(CASE WHEN LOWER(operation) = 'minus' THEN quantity ELSE 0 END)::int as removed
      FROM product_details
      WHERE product_id = ${productId}
      GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
    ),
    monthly_with_names AS (
      SELECT
        year,
        month,
        added,
        removed,
        TO_CHAR(MAKE_DATE(year, month, 1), 'Month') as month_name
      FROM monthly_data
    ),
    years_data AS (
      SELECT DISTINCT year
      FROM monthly_with_names
      ORDER BY year DESC
    )
    SELECT
      json_build_object(
        'years', (SELECT json_agg(year ORDER BY year DESC) FROM years_data),
        'dataByYear', (
          SELECT json_object(
            (SELECT array_agg(year::text ORDER BY year DESC) FROM years_data),
            (SELECT array_agg(
              (
                SELECT json_agg(json_build_object(
                  'year', year,
                  'month', month,
                  'monthName', TRIM(month_name),
                  'added', added,
                  'removed', removed
                ) ORDER BY month DESC)
              FROM monthly_with_names md WHERE md.year = y.year
            )
            FROM years_data y
          )
        )
      ) as result
    )
  `;
  return result[0]?.result || { years: [], dataByYear: {} };
};

export const getOperationSummary = async (productId, currentMonth, operation) => {
  const { startOfMonth, endOfMonth } = getDateRange(currentMonth);
  const result = await prisma.$queryRaw`
    SELECT COALESCE(SUM(quantity), 0)::int as total_quantity
    FROM product_details
    WHERE operation = ${operation}
      AND product_id = ${productId}
      AND date >= ${startOfMonth}
      AND date <= ${endOfMonth}
  `;
  return result;
};
