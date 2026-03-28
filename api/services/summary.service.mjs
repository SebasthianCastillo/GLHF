import prisma from "../lib/prisma.mjs";

export const getDateRange = (currentMonth) => {
  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).toISOString();
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  ).toISOString();
  return { startOfMonth, endOfMonth };
};

export const getMonthlySummaries = async (productId) => {
  // SQL para heavy lifting - aggregations
  const details = await prisma.$queryRaw`
    WITH monthly_data AS (
      SELECT
        EXTRACT(YEAR FROM date)::int as year,
        EXTRACT(MONTH FROM date)::int as month,
        SUM(CASE WHEN LOWER(operation) = 'add' THEN quantity ELSE 0 END)::int as added,
        SUM(CASE WHEN LOWER(operation) = 'minus' THEN quantity ELSE 0 END)::int as removed
      FROM "ProductDetail"
      WHERE "productId" = ${parseInt(productId)}
      GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
    )
    SELECT year, month, added, removed
    FROM monthly_data
    ORDER BY year DESC, month DESC
  `;

  // JS para construir respuesta
  const dataByYear = {};
  const yearsSet = new Set();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];

  for (const row of details) {
    const year = row.year;
    const month = row.month;
    yearsSet.add(year);
    
    if (!dataByYear[year]) {
      dataByYear[year] = [];
    }
    
    dataByYear[year].push({
      year,
      month,
      monthName: monthNames[month - 1],
      added: row.added || 0,
      removed: row.removed || 0,
    });
  }

  return {
    years: Array.from(yearsSet).sort((a, b) => b - a),
    dataByYear,
  };
};

export const getOperationSummary = async (
  productId,
  currentMonth,
  operation,
) => {
  const { startOfMonth, endOfMonth } = getDateRange(currentMonth);
  const result = await prisma.$queryRaw`
    SELECT COALESCE(SUM(quantity), 0)::int as total_quantity
    FROM "ProductDetail"
    WHERE operation = ${operation}
      AND "productId" = ${parseInt(productId)}
      AND date >= ${startOfMonth}::timestamp
      AND date <= ${endOfMonth}::timestamp
  `;
  return result;
};
