import { ORDER_STATUS } from '../constants/orderStatus';
import { defaultAddress } from '../mock/addresses';

class OrderService {
  list = [];

  constructor() {
    this._loadData();
  }

  createOrder({ userAccount, items, address, total }) {
    const maxId = this.list.reduce((max, item) => Math.max(max, item.id), 0);
    const order = {
      id: maxId + 1,
      orderNo: `${Date.now()}`,
      userAccount,
      items,
      address: address || { ...defaultAddress },
      total,
      status: ORDER_STATUS.UNPAID,
      createTime: new Date().toLocaleString(),
      payTime: null,
      payMethod: null,
      source: 'APP订单',
    };
    this.list.push(order);
    this._saveData();
    return order;
  }

  payOrder(orderId, payMethod = 'alipay') {
    const order = this.getOrderById(orderId);
    if (!order || order.status !== ORDER_STATUS.UNPAID) return false;
    order.status = ORDER_STATUS.PAID;
    order.payTime = new Date().toLocaleString();
    order.payMethod = payMethod;
    this._saveData();
    return true;
  }

  shipOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (!order || order.status !== ORDER_STATUS.PAID) return false;
    order.status = ORDER_STATUS.SHIPPED;
    this._saveData();
    return true;
  }

  completeOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (!order || order.status !== ORDER_STATUS.SHIPPED) return false;
    order.status = ORDER_STATUS.COMPLETED;
    this._saveData();
    return true;
  }

  closeOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (!order) return false;
    order.status = ORDER_STATUS.CLOSED;
    this._saveData();
    return true;
  }

  getOrderById(orderId) {
    return this.list.find((item) => item.id === Number(orderId));
  }

  getOrdersByUser(userAccount) {
    return this.list
      .filter((o) => o.userAccount === userAccount)
      .sort((a, b) => b.id - a.id);
  }

  getAllOrders() {
    return [...this.list].sort((a, b) => b.id - a.id);
  }

  deleteOrder(orderId) {
    this.list = this.list.filter((o) => o.id !== Number(orderId));
    this._saveData();
  }

  _saveData() {
    localStorage.setItem('orderList', JSON.stringify(this.list));
  }

  _loadData() {
    const list = localStorage.getItem('orderList');
    if (list) {
      this.list = JSON.parse(list);
      this._migrateLegacyOrders();
    } else {
      this.list = [];
      this._saveData();
    }
  }

  _migrateLegacyOrders() {
    this.list = this.list.map((o) => {
      if (o.items) return o;
      return {
        ...o,
        userAccount: o.userAccount || 'member',
        items: o.goodId
          ? [{ goodId: o.goodId, count: 1, price: o.price, name: `商品${o.goodId}` }]
          : [],
        address: o.address || { ...defaultAddress },
        total: o.total ?? o.price ?? 0,
        source: o.source || 'APP订单',
      };
    });
    this._saveData();
  }
}

const orderService = new OrderService();
export default orderService;
