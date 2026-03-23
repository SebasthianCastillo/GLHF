import authRoutes from './auth.routes.mjs';
import userRoutes from './user.routes.mjs';
import categoryRoutes from './category.routes.mjs';
import productRoutes from './product.routes.mjs';
import detailRoutes from './detail.routes.mjs';
import pdfRoutes from './pdf.routes.mjs';
import expenseRoutes from './expense.routes.mjs';

export const registerRoutes = (app) => {
  app.use(authRoutes);
  app.use(userRoutes);
  app.use(categoryRoutes);
  app.use(productRoutes);
  app.use(detailRoutes);
  app.use(pdfRoutes);
  app.use(expenseRoutes);
};
