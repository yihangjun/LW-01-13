import { Router } from 'express';
import { readDb, updateDb } from '../lib/db.js';

const router = Router();

router.get('/', (_req, res) => {
  const db = readDb();
  const list = [...db.goods].sort((a, b) => a.sort - b.sort);
  res.json({ ok: true, data: list });
});

router.get('/hot', (_req, res) => {
  const db = readDb();
  const list = db.goods.filter((g) => g.isHot).sort((a, b) => a.sort - b.sort);
  res.json({ ok: true, data: list });
});

router.get('/search', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const db = readDb();
  if (!q) {
    const hot = db.goods.filter((g) => g.isHot);
    return res.json({ ok: true, data: hot });
  }
  const list = db.goods.filter((g) => g.name.toLowerCase().includes(q));
  res.json({ ok: true, data: list });
});

router.get('/paged', (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.max(1, Number(req.query.pageSize) || 4);
  const db = readDb();
  const hot = db.goods.filter((g) => g.isHot).sort((a, b) => a.sort - b.sort);
  const start = (page - 1) * pageSize;
  res.json({
    ok: true,
    data: {
      list: hot.slice(start, start + pageSize),
      total: hot.length,
      hasMore: start + pageSize < hot.length,
    },
  });
});

router.get('/category/:categoryId', (req, res) => {
  const db = readDb();
  const list = db.goods
    .filter((g) => g.categoryId === req.params.categoryId)
    .sort((a, b) => a.sort - b.sort);
  res.json({ ok: true, data: list });
});

router.get('/:id', (req, res) => {
  const db = readDb();
  const good = db.goods.find((g) => g.id === Number(req.params.id));
  if (!good) {
    return res.status(404).json({ ok: false, message: '商品不存在' });
  }
  res.json({ ok: true, data: good });
});

router.post('/', (req, res) => {
  const payload = req.body || {};
  const db = updateDb((data) => {
    const maxId = data.goods.reduce((max, item) => Math.max(max, item.id), 0);
    const newGood = {
      ...payload,
      id: maxId + 1,
      sales: payload.sales ?? 0,
      auditStatus: payload.auditStatus ?? '未审核',
    };
    data.goods.push(newGood);
    return newGood;
  });
  const created = db.goods[db.goods.length - 1];
  res.status(201).json({ ok: true, data: created });
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  let updated = null;
  updateDb((data) => {
    data.goods = data.goods.map((item) => {
      if (item.id !== id) return item;
      updated = { ...item, ...req.body, id };
      return updated;
    });
  });
  if (!updated) {
    return res.status(404).json({ ok: false, message: '商品不存在' });
  }
  res.json({ ok: true, data: updated });
});

router.patch('/:id/toggle/:field', (req, res) => {
  const id = Number(req.params.id);
  const { field } = req.params;
  let updated = null;
  updateDb((data) => {
    const good = data.goods.find((g) => g.id === id);
    if (!good) return;
    good[field] = !good[field];
    updated = { ...good };
  });
  if (!updated) {
    return res.status(404).json({ ok: false, message: '商品不存在' });
  }
  res.json({ ok: true, data: updated });
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  let found = false;
  updateDb((data) => {
    const before = data.goods.length;
    data.goods = data.goods.filter((g) => g.id !== id);
    found = data.goods.length < before;
  });
  if (!found) {
    return res.status(404).json({ ok: false, message: '商品不存在' });
  }
  res.json({ ok: true });
});

export default router;
