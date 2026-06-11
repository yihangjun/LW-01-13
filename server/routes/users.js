import { Router } from 'express';
import { readDb, updateDb } from '../lib/db.js';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const trimmed = String(username || '').trim();
  if (!trimmed || !password) {
    return res.status(400).json({ ok: false, message: '请输入用户名和密码' });
  }
  const db = readDb();
  const found = db.users.find(
    (u) => u.username === trimmed && u.password === password,
  );
  if (!found) {
    return res.status(401).json({ ok: false, message: '用户名或密码错误' });
  }
  const session = {
    username: found.username,
    nickname: found.nickname || found.username,
    phone: found.phone || '',
    address: found.address || '',
  };
  res.json({ ok: true, data: session });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  const trimmed = String(username || '').trim();
  if (!trimmed) {
    return res.status(400).json({ ok: false, message: '请输入用户名' });
  }
  if (trimmed.length < 2) {
    return res.status(400).json({ ok: false, message: '用户名至少 2 个字符' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ ok: false, message: '密码至少 6 位' });
  }
  const db = readDb();
  if (db.users.some((u) => u.username === trimmed)) {
    return res.status(409).json({ ok: false, message: '用户名已存在' });
  }
  const newUser = { username: trimmed, password, nickname: trimmed };
  updateDb((data) => {
    data.users.push(newUser);
  });
  res.status(201).json({ ok: true, message: '注册成功，请登录' });
});

router.put('/:username', (req, res) => {
  const username = req.params.username;
  let updated = null;
  updateDb((data) => {
    const idx = data.users.findIndex((u) => u.username === username);
    if (idx === -1) return;
    data.users[idx] = { ...data.users[idx], ...req.body, username };
    const u = data.users[idx];
    updated = {
      username: u.username,
      nickname: u.nickname || u.username,
      phone: u.phone || '',
      address: u.address || '',
    };
  });
  if (!updated) {
    return res.status(404).json({ ok: false, message: '用户不存在' });
  }
  res.json({ ok: true, data: updated });
});

export default router;
