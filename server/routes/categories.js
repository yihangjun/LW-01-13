import { Router } from 'express';
import { readDb, updateDb } from '../lib/db.js';

const router = Router();

router.get('/', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, data: db.categories });
});

router.put('/', (req, res) => {
  const categories = Array.isArray(req.body) ? req.body : req.body?.categories;
  if (!Array.isArray(categories)) {
    return res.status(400).json({ ok: false, message: '分类数据格式错误' });
  }
  const normalized = categories.map((c) => ({
    id: c.id,
    name: c.name,
    children: (c.children || []).map((ch) => ({ id: ch.id, name: ch.name })),
  }));
  updateDb((data) => {
    data.categories = normalized;
  });
  res.json({ ok: true, data: normalized });
});

export default router;
