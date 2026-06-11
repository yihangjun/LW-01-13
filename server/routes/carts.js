import { Router } from 'express';
import { readDb, updateDb } from '../lib/db.js';

const router = Router();

function normalizeItems(items) {
  return items.map((item) => ({
    goodId: Number(item.goodId),
    count: Math.max(1, Number(item.count) || 1),
    selected: item.selected !== false,
  }));
}

router.get('/:userAccount', (req, res) => {
  const key = String(req.params.userAccount);
  const db = readDb();
  const items = db.carts[key] || [];
  res.json({ ok: true, data: items });
});

router.put('/:userAccount', (req, res) => {
  const key = String(req.params.userAccount);
  const raw = req.body?.items;
  if (!Array.isArray(raw)) {
    return res.status(400).json({ ok: false, message: '购物车数据格式错误' });
  }
  const items = normalizeItems(raw);
  updateDb((data) => {
    if (!data.carts) data.carts = {};
    data.carts[key] = items;
  });
  res.json({ ok: true, data: items });
});

export default router;
