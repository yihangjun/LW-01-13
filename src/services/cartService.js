import { request } from '../utils/api';

const GUEST_KEY = 'cartList';

function mergeItems(local = [], remote = []) {
  const map = new Map(remote.map((item) => [Number(item.goodId), { ...item }]));
  local.forEach((item) => {
    const id = Number(item.goodId);
    const existing = map.get(id);
    if (existing) {
      map.set(id, {
        ...existing,
        count: existing.count + item.count,
        selected: existing.selected || item.selected,
      });
    } else {
      map.set(id, { ...item, goodId: id });
    }
  });
  return [...map.values()];
}

class CartService {
  async load(userAccount) {
    if (!userAccount) {
      return this.loadLocal();
    }
    const res = await request(`/carts/${encodeURIComponent(userAccount)}`);
    const remote = res.data || [];
    const local = this.loadLocal();
    if (local.length === 0) {
      return remote;
    }
    const merged = mergeItems(local, remote);
    await this.save(userAccount, merged);
    this.saveLocal([]);
    return merged;
  }

  loadLocal() {
    try {
      const raw = localStorage.getItem(GUEST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveLocal(items) {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  }

  async save(userAccount, items) {
    if (!userAccount) {
      this.saveLocal(items);
      return items;
    }
    const res = await request(`/carts/${encodeURIComponent(userAccount)}`, {
      method: 'PUT',
      body: { items },
    });
    this.saveLocal(items);
    return res.data || items;
  }

  async clear(userAccount) {
    return this.save(userAccount, []);
  }
}

const cartService = new CartService();
export default cartService;
