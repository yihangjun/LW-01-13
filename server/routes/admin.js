import { Router } from 'express';
import { readDb, updateDb } from '../lib/db.js';

const router = Router();

const ADMIN_MODULES = [
  { key: 'goods', label: '商品管理', desc: '商品增删改查、上下架' },
  { key: 'categories', label: '分类管理', desc: '商品分类维护' },
  { key: 'orders', label: '订单管理', desc: '订单查询、发货' },
  { key: 'roles', label: '权限管理', desc: '角色与后台用户' },
];

router.get('/modules', (_req, res) => {
  res.json({ ok: true, data: ADMIN_MODULES });
});

router.get('/roles', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, data: db.adminRoles });
});

router.put('/roles/:roleId/permissions', (req, res) => {
  const { roleId } = req.params;
  const permissions = req.body?.permissions;
  if (!Array.isArray(permissions)) {
    return res.status(400).json({ ok: false, message: '权限数据格式错误' });
  }
  let ok = false;
  updateDb((data) => {
    const role = data.adminRoles.find((r) => r.id === roleId);
    if (!role) return;
    role.permissions = permissions;
    ok = true;
  });
  res.json({ ok });
});

router.get('/users', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, data: db.adminUsers });
});

router.post('/users', (req, res) => {
  const user = req.body || {};
  if (!user.username) {
    return res.status(400).json({ ok: false, message: '用户名不能为空' });
  }
  const db = readDb();
  if (db.adminUsers.some((u) => u.username === user.username)) {
    return res.status(409).json({ ok: false, message: '用户名已存在' });
  }
  updateDb((data) => {
    data.adminUsers.push(user);
  });
  res.status(201).json({ ok: true });
});

router.put('/users/:username', (req, res) => {
  const { username } = req.params;
  let ok = false;
  updateDb((data) => {
    const idx = data.adminUsers.findIndex((u) => u.username === username);
    if (idx === -1) return;
    data.adminUsers[idx] = { ...data.adminUsers[idx], ...req.body, username };
    ok = true;
  });
  res.json({ ok: ok ? true : false, message: ok ? undefined : '用户不存在' });
});

router.delete('/users/:username', (req, res) => {
  const { username } = req.params;
  if (username === 'admin') {
    return res.status(403).json({ ok: false, message: '不能删除默认超级管理员' });
  }
  let ok = false;
  updateDb((data) => {
    const before = data.adminUsers.length;
    data.adminUsers = data.adminUsers.filter((u) => u.username !== username);
    ok = data.adminUsers.length < before;
  });
  res.json({ ok });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const trimmed = String(username || '').trim();
  const db = readDb();
  const user = db.adminUsers.find(
    (u) => u.username === trimmed && u.password === password,
  );
  if (!user) {
    return res.status(401).json({ ok: false, message: '账号或密码错误' });
  }
  const role = db.adminRoles.find((r) => r.id === user.roleId);
  if (!role) {
    return res.status(500).json({ ok: false, message: '角色配置异常' });
  }
  const session = {
    username: user.username,
    name: user.name,
    roleId: user.roleId,
    roleName: role.name,
    permissions: [...role.permissions],
  };
  res.json({ ok: true, data: session });
});

export default router;
