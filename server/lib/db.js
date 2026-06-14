import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSeedDb, GOODS_VERSION } from '../data/seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function mergeUsers(existing = [], defaults = []) {
  const map = new Map(defaults.map((u) => [u.username, { ...u }]));
  existing.forEach((u) => map.set(u.username, { ...map.get(u.username), ...u }));
  return [...map.values()];
}

function mergeAdminRoles(existing = [], defaults = []) {
  const map = new Map(
    defaults.map((r) => [r.id, { ...r, permissions: [...r.permissions] }]),
  );
  existing.forEach((r) => {
    const base = map.get(r.id);
    map.set(r.id, {
      ...(base || r),
      ...r,
      permissions: r.permissions || base?.permissions || [],
    });
  });
  return [...map.values()];
}

function buildSyncedDb(db) {
  const seed = createSeedDb();
  const versionMigrate = db.version !== GOODS_VERSION;
  const next = {
    ...db,
    version: GOODS_VERSION,
    users: mergeUsers(db.users, seed.users),
    adminUsers: mergeUsers(db.adminUsers, seed.adminUsers),
    adminRoles: mergeAdminRoles(db.adminRoles, seed.adminRoles),
    orders: db.orders?.length ? db.orders : seed.orders,
    carts: db.carts || {},
  };
  if (versionMigrate) {
    next.goods = seed.goods;
    next.categories = seed.categories;
  }
  return next;
}

function ensureDbFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(createSeedDb(), null, 2), 'utf8');
    return;
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const next = buildSyncedDb(db);
  if (JSON.stringify(next) !== JSON.stringify(db)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(next, null, 2), 'utf8');
  }
}

export function readDb() {
  ensureDbFile();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

export function writeDb(updater) {
  const db = readDb();
  const next = typeof updater === 'function' ? updater(db) : updater;
  fs.writeFileSync(DB_PATH, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

export function updateDb(mutator) {
  return writeDb((db) => {
    mutator(db);
    return db;
  });
}
