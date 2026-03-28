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
      status: "OVERDUE",
    },
    include: {
      category: true,
    },
  });

  return expense;
};

export const payExpense = async (expenseId, amount) => {
  return prisma.$transaction(async (tx) => {
    const expense = await tx.expense.findUnique({ where: { id: expenseId } });
    
    if (!expense) {
      throw new Error("Expense not found");
    }
    
    const payment = await tx.payment.create({
      data: { 
        expenseId, 
        amount: parseFloat(amount) 
      }
    });
    
    const totalPaid = await tx.payment.aggregate({
      where: { expenseId },
      _sum: { amount: true }
    });
    
    const newStatus = (totalPaid._sum.amount || 0) >= expense.amount 
      ? 'PAID' 
      : 'PARTIAL';
    
    await tx.expense.update({
      where: { id: expenseId },
      data: { status: newStatus }
    });
    
    return payment;
  });
};

export const getPaymentsByExpense = async (expenseId) => {
  return prisma.payment.findMany({
    where: { expenseId },
    orderBy: { paidAt: 'desc' }
  });
};
