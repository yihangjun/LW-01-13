class CartService {
  items = [];

  constructor() {
    this._loadData();
  }

  getItems() {
    return [...this.items];
  }

  addItem(goodId, count = 1) {
    const id = Number(goodId);
    const existing = this.items.find((i) => i.goodId === id);
    if (existing) {
      existing.count += count;
    } else {
      this.items.push({ goodId: id, count, selected: true });
    }
    this._saveData();
  }

  updateCount(goodId, count) {
    const id = Number(goodId);
    const item = this.items.find((i) => i.goodId === id);
    if (!item) return;
    if (count <= 0) {
      this.removeItem(id);
      return;
    }
    item.count = count;
    this._saveData();
  }

  removeItem(goodId) {
    const id = Number(goodId);
    this.items = this.items.filter((i) => i.goodId !== id);
    this._saveData();
  }

  toggleSelect(goodId) {
    const item = this.items.find((i) => i.goodId === Number(goodId));
    if (item) {
      item.selected = !item.selected;
      this._saveData();
    }
  }

  selectAll(selected) {
    this.items.forEach((i) => { i.selected = selected; });
    this._saveData();
  }

  clear() {
    this.items = [];
    this._saveData();
  }

  getSelectedItems() {
    return this.items.filter((i) => i.selected);
  }

  _saveData() {
    localStorage.setItem('cartList', JSON.stringify(this.items));
  }

  _loadData() {
    const raw = localStorage.getItem('cartList');
    this.items = raw ? JSON.parse(raw) : [];
  }
}

const cartService = new CartService();
export default cartService;
