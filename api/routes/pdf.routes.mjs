import { Router } from 'express';
import { chromium } from 'playwright';
import prisma from '../lib/prisma.mjs';
import { asyncHandler } from '../lib/errors.mjs';

const router = Router();

router.get(
  '/generate-pdf/:id',
  asyncHandler(async (req, res) => {
    const categoryId = parseInt(req.params.id);

    const [productsByCategory, category] = await Promise.all([
      prisma.producto.findMany({ where: { categoryId } }),
      prisma.category.findUnique({ where: { id: categoryId } })
    ]);

    if (!productsByCategory?.length) {
      const error = new Error('No products found for this category');
      error.statusCode = 404;
      throw error;
    }

    const rowsHtml = productsByCategory
      .map((p) => `<tr><td>${p.name ?? ''}</td><td>${p.quantity ?? ''}</td></tr>`)
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
      color: #1f2937;
      background: #ffffff;
      margin: 0;
      padding: 60px;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      padding: 50px 60px;
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    }
    .date {
      text-align: right;
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 20px;
    }
    .title {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
      letter-spacing: -0.02em;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
      font-size: 15px;
    }
    th, td {
      padding: 12px 10px;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background-color: #f3f4f6;
      color: #374151;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: 13px;
      text-align: left;
    }
    th:nth-child(2) { text-align: center; }
    td { color: #374151; text-align: left; }
    td:nth-child(2) { text-align: center; }
    tr:nth-child(even) td { background-color: #f9fafb; }
    tr:hover td { background-color: #f3f4f6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="date">${new Date().toLocaleDateString()}</div>
    <div class="title">${category?.name || 'Category'}</div>
    <table>
      <thead><tr><th>Name</th><th>Quantity</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>
</body>
</html>`;

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(pdf);
  })
);

export default router;
