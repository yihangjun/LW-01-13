import { request } from '../utils/api';

class CategoryService {
  list = [];
  ready = false;

  async init() {
    const res = await request('/categories');
    this.list = res.data || [];
    this.ready = true;
    return this.list;
  }

  getList() {
    return this.list;
  }

  getAll() {
    const icons = {
      '1': '👔',
      '2': '📱',
      '3': '🏠',
      '4': '🛋️',
      '5': '🚗',
      '6': '💻',
    };
    return this.list.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon || icons[c.id] || '📦',
    }));
  }

  getById(id) {
    return this.list.find((c) => c.id === id);
  }

  findCategory(id) {
    if (!id) return null;
    for (const parent of this.list) {
      if (parent.id === id) {
        return { id: parent.id, name: parent.name, parentId: null, isParent: true };
      }
      const child = (parent.children || []).find((ch) => ch.id === id);
      if (child) {
        return {
          id: child.id,
          name: child.name,
          parentId: parent.id,
          parentName: parent.name,
          isParent: false,
        };
      }
    }
    return null;
  }

  getParentId(categoryId) {
    const found = this.findCategory(categoryId);
    if (!found) return categoryId;
    return found.parentId || found.id;
  }

  goodsMatchCategory(goodCategoryId, filterCategoryId) {
    if (!filterCategoryId) return true;
    if (!goodCategoryId) return false;
    if (goodCategoryId === filterCategoryId) return true;
    const filter = this.findCategory(filterCategoryId);
    if (filter?.isParent) {
      return this.getParentId(goodCategoryId) === filterCategoryId;
    }
    return false;
  }

  getDisplayInfo(categoryId) {
    const icons = {
      '1': '👔', '2': '📱', '3': '🏠', '4': '🛋️', '5': '🚗', '6': '💻',
    };
    const found = this.findCategory(categoryId);
    if (!found) return null;
    const parentId = found.parentId || found.id;
    return {
      id: found.id,
      name: found.name,
      parentId,
      parentName: found.parentName || found.name,
      icon: icons[parentId] || '📦',
      label: found.isParent ? found.name : `${found.parentName} · ${found.name}`,
    };
  }

  async add(category) {
    const exists = this.list.some((c) => c.id === category.id);
    if (exists) throw new Error('分类 ID 已存在');
    this.list.push(category);
    await this.replaceAll(this.list);
  }

  async update(category) {
    this.list = this.list.map((c) =>
      c.id === category.id ? { ...c, ...category } : c,
    );
    await this.replaceAll(this.list);
  }

  async delete(id) {
    this.list = this.list.filter((c) => c.id !== id);
    await this.replaceAll(this.list);
  }

  async replaceAll(categories) {
    this.list = categories.map((c) => ({
      id: c.id,
      name: c.name,
      children: (c.children || []).map((ch) => ({ id: ch.id, name: ch.name })),
    }));
    const res = await request('/categories', { method: 'PUT', body: this.list });
    this.list = res.data || this.list;
    return this.list;
  }
}

const categoryService = new CategoryService();
export default categoryService;
