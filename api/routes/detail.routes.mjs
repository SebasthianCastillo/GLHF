import { Router } from 'express';
import prisma from '../lib/prisma.mjs';
import { asyncHandler } from '../lib/errors.mjs';
import { validate, validateQuery } from '../middleware/validate.mjs';
import { addProductDetailSchema, productDetailQuerySchema } from '../validators/product.validator.mjs';
import { getOperationSummary, getMonthlySummaries } from '../services/summary.service.mjs';

const router = Router();

router.post(
  '/addProductDetail',
  validate(addProductDetailSchema),
  asyncHandler(async (req, res) => {
    const { quantity, date, format, operation, ProductID, cost } = req.body;
    await prisma.productDetail.create({
      data: {
        quantity: parseInt(quantity),
        date: new Date(date),
        format,
        operation,
        productId: parseInt(ProductID),
        cost: parseFloat(cost) || 0
      }
    });
    res.status(201).json({ message: 'Product Detail saved successfully' });
  })
);

router.get(
  '/productDetailByIDProduct',
  validateQuery(productDetailQuerySchema),
  asyncHandler(async (req, res) => {
    const { ProductKey } = req.query;
    const productDetail = await prisma.productDetail.findMany({
      where: { productId: parseInt(ProductKey) }
    });
    res.status(200).json(productDetail);
  })
);

router.get(
  '/productDetailSummaryByOperationAdd',
  validateQuery(productDetailQuerySchema),
  asyncHandler(async (req, res) => {
    const { ProductKey } = req.query;
    const currentMonth = new Date(req.query.currentMonth);
    const result = await getOperationSummary(ProductKey, currentMonth, 'add');
    res.status(200).json(result);
  })
);

router.get(
  '/productDetailSummaryByOperationMinus',
  validateQuery(productDetailQuerySchema),
  asyncHandler(async (req, res) => {
    const { ProductKey } = req.query;
    const currentMonth = new Date(req.query.currentMonth);
    const result = await getOperationSummary(ProductKey, currentMonth, 'minus');
    res.status(200).json(result);
  })
);

router.get(
  '/getMonthlySummaries',
  validateQuery(productDetailQuerySchema),
  asyncHandler(async (req, res) => {
    const { ProductKey } = req.query;
    const result = await getMonthlySummaries(ProductKey);
    res.status(200).json(result);
  })
);

export default router;
