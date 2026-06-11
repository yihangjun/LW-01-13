import { Router } from 'express';
import { readDb, updateDb } from '../lib/db.js';

const ORDER_STATUS = {
  UNPAID: 0,
  PAID: 1,
  SHIPPED: 2,
  COMPLETED: 3,
  CLOSED: 4,
};

const defaultAddress = {
  name: '张三',
  phone: '13800138000',
  detail: '北京市朝阳区三里屯街道 1 号',
};

const router = Router();

router.get('/', (_req, res) => {
  const db = readDb();
  const list = [...db.orders].sort((a, b) => b.id - a.id);
  res.json({ ok: true, data: list });
});

router.get('/user/:userAccount', (req, res) => {
  const key = String(req.params.userAccount);
  const db = readDb();
  const list = db.orders
    .filter((o) => o.userAccount === key || String(o.userId) === key)
    .sort((a, b) => b.id - a.id);
  res.json({ ok: true, data: list });
});

router.get('/:id', (req, res) => {
  const db = readDb();
  const order = db.orders.find((o) => o.id === Number(req.params.id));
  if (!order) {
    return res.status(404).json({ ok: false, message: '订单不存在' });
  }
  res.json({ ok: true, data: order });
});

router.post('/', (req, res) => {
  const { userAccount, items, address, total } = req.body || {};
  let created = null;
  updateDb((data) => {
    const maxId = data.orders.reduce((max, item) => Math.max(max, item.id), 0);
    created = {
      id: maxId + 1,
      orderNo: `${Date.now()}`,
      userAccount,
      items: items || [],
      address: address || { ...defaultAddress },
      total: total ?? 0,
      status: ORDER_STATUS.UNPAID,
      createTime: new Date().toLocaleString(),
      payTime: null,
      payMethod: null,
      source: 'APP订单',
    };
    data.orders.push(created);
  });
  res.status(201).json({ ok: true, data: created });
});

router.patch('/:id/pay', (req, res) => {
  const id = Number(req.params.id);
  const payMethod = req.body?.payMethod || 'alipay';
  let ok = false;
  updateDb((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order || order.status !== ORDER_STATUS.UNPAID) return;
    order.status = ORDER_STATUS.PAID;
    order.payTime = new Date().toLocaleString();
    order.payMethod = payMethod;
    ok = true;
  });
  res.json({ ok });
});

router.patch('/:id/ship', (req, res) => {
  const id = Number(req.params.id);
  let ok = false;
  updateDb((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order || order.status !== ORDER_STATUS.PAID) return;
    order.status = ORDER_STATUS.SHIPPED;
    ok = true;
  });
  res.json({ ok });
});

router.patch('/:id/complete', (req, res) => {
  const id = Number(req.params.id);
  let ok = false;
  updateDb((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order || order.status !== ORDER_STATUS.SHIPPED) return;
    order.status = ORDER_STATUS.COMPLETED;
    ok = true;
  });
  res.json({ ok });
});

router.patch('/:id/cancel', (req, res) => {
  const id = Number(req.params.id);
  let ok = false;
  updateDb((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order || order.status !== ORDER_STATUS.UNPAID) return;
    order.status = ORDER_STATUS.CLOSED;
    ok = true;
  });
  res.json({ ok });
});

router.patch('/:id/close', (req, res) => {
  const id = Number(req.params.id);
  let ok = false;
  updateDb((data) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order) return;
    order.status = ORDER_STATUS.CLOSED;
    ok = true;
  });
  res.json({ ok });
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  let found = false;
  updateDb((data) => {
    const before = data.orders.length;
    data.orders = data.orders.filter((o) => o.id !== id);
    found = data.orders.length < before;
  });
  if (!found) {
    return res.status(404).json({ ok: false, message: '订单不存在' });
  }
  res.json({ ok: true });
});

export default router;
