import { Router } from "express";
import prisma from "../lib/prisma.mjs";
import { asyncHandler } from "../lib/errors.mjs";
import { validate } from "../middleware/validate.mjs";
import {
  addProductSchema,
  quantityUpdateSchema,
  updateProductNameSchema,
  updateProductCostSchema,
} from "../validators/product.validator.mjs";

const router = Router();

router.post(
  "/addProduct",
  validate(addProductSchema),
  asyncHandler(async (req, res) => {
    const { Name, quantity, CategoryID } = req.body;
    await prisma.producto.create({
      data: {
        name: Name,
        quantity: parseInt(quantity) || 0,
        categoryId: CategoryID ? parseInt(CategoryID) : null,
      },
    });
    res.status(201).json({ message: "Product saved successfully" });
  }),
);

router.get(
  "/productsByIDCategory",
  asyncHandler(async (req, res) => {
    const CategoryID = req.query.CategoryKey;
    const products = await prisma.producto.findMany({
      where: { categoryId: parseInt(CategoryID) },
      orderBy: { name: "asc" },
    });
    console.log(products);
    res.status(200).json(products);
  }),
);

router.patch(
  "/quantityUpdateProduct",
  validate(quantityUpdateSchema),
  asyncHandler(async (req, res) => {
    const { _id, quantity, operation, cost } = req.body;
    const productId = parseInt(_id);

    if (operation === "add") {
      const costValue = parseFloat(cost) || 0;
      await prisma.$transaction([
        prisma.producto.update({
          where: { id: productId },
          data: {
            quantity: { increment: parseInt(quantity) },
            totalSpent: { increment: parseInt(quantity) * costValue },
            cost: costValue,
          },
        }),
      ]);
    } else {
      await prisma.producto.update({
        where: { id: productId },
        data: {
          quantity: { decrement: parseInt(quantity) },
        },
      });
    }

    res.status(201).json({ message: "Product Detail saved successfully" });
  }),
);

router.patch(
  "/updateProductCost/:id",
  validate(updateProductCostSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cost } = req.body;
    const result = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { cost: parseFloat(cost) },
    });
    res
      .status(200)
      .json({ message: "Costo actualizado exitosamente", product: result });
  }),
);

router.patch(
  "/updateProductName/:id",
  validate(updateProductNameSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;
    const updatedProduct = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { name: newName },
    });
    res.status(200).json({
      message: "Nombre del producto actualizado exitosamente",
      product: updatedProduct,
    });
  }),
);

router.delete(
  "/deleteProduct/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.producto.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Producto eliminado exitosamente" });
  }),
);

export default router;
