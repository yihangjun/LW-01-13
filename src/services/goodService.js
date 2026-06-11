import { request } from '../utils/api';

class GoodService {
  list = [];
  ready = false;

  async init() {
    const res = await request('/goods');
    this.list = res.data || [];
    this.ready = true;
    return this.list;
  }

  getGoodById(id) {
    const numId = Number(id);
    return this.list.find((item) => item.id === numId);
  }

  getGoodList() {
    return [...this.list].sort((a, b) => a.sort - b.sort);
  }

  getHotGoods() {
    return this.getGoodList().filter((item) => item.isHot);
  }

  getGoodsByCategory(categoryId) {
    return this.getGoodList().filter((item) => item.categoryId === categoryId);
  }

  searchGoods(keyword) {
    const q = keyword.trim().toLowerCase();
    if (!q) return this.getHotGoods();
    return this.list.filter((item) => item.name.toLowerCase().includes(q));
  }

  getPagedGoods(page = 1, pageSize = 4) {
    const list = this.getHotGoods();
    const start = (page - 1) * pageSize;
    return {
      list: list.slice(start, start + pageSize),
      total: list.length,
      hasMore: start + pageSize < list.length,
    };
  }

  async addGood(good) {
    const res = await request('/goods', { method: 'POST', body: good });
    const created = res.data;
    this.list.push(created);
    return created;
  }

  async deleteGood(id) {
    const numId = Number(id);
    await request(`/goods/${numId}`, { method: 'DELETE' });
    this.list = this.list.filter((item) => item.id !== numId);
  }

  async updateGood(good) {
    const res = await request(`/goods/${good.id}`, { method: 'PUT', body: good });
    const updated = res.data;
    this.list = this.list.map((item) =>
      item.id === updated.id ? updated : item,
    );
    return updated;
  }

  async toggleField(id, field) {
    const res = await request(`/goods/${id}/toggle/${field}`, { method: 'PATCH' });
    const updated = res.data;
    const idx = this.list.findIndex((g) => g.id === Number(id));
    if (idx !== -1) {
      this.list[idx] = updated;
    }
    return updated;
  }
}

const goodService = new GoodService();
export default goodService;
