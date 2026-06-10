import { defaultCategories } from '../mock/categories';

class CategoryService {
  list = [];

  constructor() {
    this._loadData();
  }

  getList() {
    return this.list;
  }

  /** 商城前台扁平分类（含 icon），兼容同学版 UI */
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

  /** 解析主分类或子分类 */
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

  /** 商品分类是否匹配筛选（支持主分类与子分类） */
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

  add(category) {
    const exists = this.list.some((c) => c.id === category.id);
    if (exists) throw new Error('分类 ID 已存在');
    this.list.push(category);
    this._saveData();
  }

  update(category) {
    this.list = this.list.map((c) =>
      c.id === category.id ? { ...c, ...category } : c,
    );
    this._saveData();
  }

  delete(id) {
    this.list = this.list.filter((c) => c.id !== id);
    this._saveData();
  }

  replaceAll(categories) {
    this.list = categories.map((c) => ({
      id: c.id,
      name: c.name,
      children: (c.children || []).map((ch) => ({ id: ch.id, name: ch.name })),
    }));
    this._saveData();
  }

  _saveData() {
    localStorage.setItem('categoryList', JSON.stringify(this.list));
  }

  _loadData() {
    const raw = localStorage.getItem('categoryList');
    if (raw) {
      this.list = JSON.parse(raw);
    } else {
      this.list = defaultCategories;
      this._saveData();
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;
