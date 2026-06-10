import { defaultCategories } from '../mock/categories';

class CategoryService {
  list = [];

  constructor() {
    this._loadData();
  }

  getList() {
    return this.list;
  }

  getById(id) {
    return this.list.find((c) => c.id === id);
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
