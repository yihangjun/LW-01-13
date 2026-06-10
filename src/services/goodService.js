import { initAppData } from '../utils/initAppData';

const defaultList = [
  {
    id: 1,
    name: '小米 12 Pro',
    price: 2999,
    categoryId: '2',
    brand: '小米',
    sku: 'MI12P-128',
    stock: 100,
    isHot: true,
    onSale: true,
    isNew: true,
    isRecommended: true,
    sort: 1,
    sales: 256,
    auditStatus: '未审核',
    color: '#ff9a76',
    spec: '黑色 128G',
  },
  {
    id: 2,
    name: '华为 Mate 70',
    price: 5499,
    categoryId: '2',
    brand: '华为',
    sku: 'HW70-256',
    stock: 80,
    isHot: true,
    onSale: true,
    isNew: false,
    isRecommended: true,
    sort: 2,
    sales: 189,
    auditStatus: '未审核',
    color: '#6b8cff',
    spec: '白色 256G',
  },
  {
    id: 3,
    name: '苹果 iPhone 16',
    price: 6999,
    categoryId: '2',
    brand: 'Apple',
    sku: 'IP16-128',
    stock: 60,
    isHot: true,
    onSale: false,
    isNew: true,
    isRecommended: true,
    sort: 3,
    sales: 320,
    auditStatus: '未审核',
    color: '#a8e6cf',
    spec: '原色 128G',
  },
  {
    id: 4,
    name: '联想笔记本电脑',
    price: 4599,
    categoryId: '6',
    brand: '联想',
    sku: 'LN-4599',
    stock: 45,
    isHot: true,
    onSale: true,
    isNew: false,
    isRecommended: false,
    sort: 4,
    sales: 98,
    auditStatus: '未审核',
    color: '#ffd3b6',
    spec: '16G 512G',
  },
  {
    id: 5,
    name: '戴森吹风机',
    price: 2890,
    categoryId: '3',
    brand: '戴森',
    sku: 'DY-2890',
    stock: 30,
    isHot: false,
    onSale: true,
    isNew: false,
    isRecommended: false,
    sort: 5,
    sales: 67,
    auditStatus: '未审核',
    color: '#dcedc1',
    spec: '紫红色',
  },
  {
    id: 6,
    name: '耐克运动鞋',
    price: 699,
    categoryId: '1',
    brand: '耐克',
    sku: 'NK-699',
    stock: 200,
    isHot: true,
    onSale: true,
    isNew: true,
    isRecommended: true,
    sort: 6,
    sales: 512,
    auditStatus: '未审核',
    color: '#ffaaa5',
    spec: '42码 黑色',
  },
];

class GoodService {
  list = [];

  constructor() {
    initAppData();
    this._loadData();
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

  addGood(good) {
    const maxId = this.list.reduce((max, item) => Math.max(max, item.id), 0);
    const newGood = {
      ...good,
      id: maxId + 1,
      sales: good.sales ?? 0,
      auditStatus: good.auditStatus ?? '未审核',
    };
    this.list.push(newGood);
    this._saveData();
    return newGood;
  }

  deleteGood(id) {
    this.list = this.list.filter((item) => item.id !== Number(id));
    this._saveData();
  }

  updateGood(good) {
    this.list = this.list.map((item) =>
      item.id === good.id ? { ...item, ...good } : item,
    );
    this._saveData();
  }

  toggleField(id, field) {
    const good = this.getGoodById(id);
    if (!good) return;
    good[field] = !good[field];
    this._saveData();
  }

  _saveData() {
    localStorage.setItem('goodList', JSON.stringify(this.list));
  }

  _loadData() {
    const version = localStorage.getItem('goodListVersion');
    const list = localStorage.getItem('goodList');
    if (list && version === '5') {
      this.list = JSON.parse(list);
      this._migrateFields();
    } else {
      this.list = defaultList.map((g) => ({ ...g }));
      localStorage.setItem('goodListVersion', '5');
      this._saveData();
    }
  }

  _migrateFields() {
    this.list = this.list.map((item, index) => {
      const fallback = defaultList.find((d) => d.id === item.id) || defaultList[index % defaultList.length];
      return {
        ...fallback,
        ...item,
        isHot: item.isHot ?? fallback?.isHot ?? true,
        onSale: item.onSale ?? true,
        brand: item.brand ?? fallback?.brand ?? '品牌',
        spec: item.spec ?? fallback?.spec ?? '默认规格',
        color: item.color ?? fallback?.color ?? '#ccc',
      };
    });
    if (this.list.length === 0) {
      this.list = defaultList.map((g) => ({ ...g }));
    }
    this._saveData();
  }
}

const goodService = new GoodService();
export default goodService;
