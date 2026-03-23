import prisma from "../lib/prisma.mjs";

export const getExpenses = async (filters) => {
  const { fromDate, toDate, categoryId, status } = filters;

  const fromDateParam = fromDate ? new Date(fromDate) : null;
  const toDateParam = toDate ? new Date(toDate + "T23:59:59.999Z") : null;
  const categoryIdParam = categoryId ? parseInt(categoryId) : null;

  const result = await prisma.$queryRaw`
    SELECT 
      e.id,
      e.amount,
      e.date,
      e."dueDate",
      e.status,
      e."categoryId",
      e."userId",
      e.description,
      e."createdAt",
      e."updatedAt",
      c.name as "categoryName"
    FROM Expense e
    LEFT JOIN categories c ON c.id = e."categoryId"
    WHERE
      (${fromDateParam}::TIMESTAMP IS NULL OR e.date >= ${fromDateParam}::TIMESTAMP)
      AND (${toDateParam}::TIMESTAMP IS NULL OR e.date <= ${toDateParam}::TIMESTAMP)
      AND (${categoryIdParam}::INTEGER IS NULL OR e."categoryId" = ${categoryIdParam}::INTEGER)
      AND (${status}::TEXT IS NULL OR e.status = ${status}::"ExpenseStatus")
    ORDER BY e.date DESC
  `;

  return result;
};

export const createExpense = async (data) => {
  const { amount, date, dueDate, categoryId, description, userId } = data;

  const expense = await prisma.expense.create({
    data: {
      amount: parseFloat(amount),
      date: new Date(date),
      dueDate: new Date(dueDate),
      categoryId: parseInt(categoryId),
      description: description || null,
      userId: parseInt(userId),
      status: "PENDING",
    },
    include: {
      category: true,
    },
  });

  return expense;
};
