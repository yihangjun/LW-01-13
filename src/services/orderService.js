import { ORDER_STATUS } from '../constants/orderStatus';
import { request } from '../utils/api';

class OrderService {
  list = [];
  ready = false;

  async init() {
    const res = await request('/orders');
    this.list = res.data || [];
    this.ready = true;
    return this.list;
  }

  async createOrder({ userAccount, items, address, total }) {
    const res = await request('/orders', {
      method: 'POST',
      body: { userAccount, items, address, total },
    });
    const order = res.data;
    this.list.push(order);
    return order;
  }

  async payOrder(orderId, payMethod = 'alipay') {
    const order = this.getOrderById(orderId);
    if (!order || order.status !== ORDER_STATUS.UNPAID) {
      throw new Error('订单状态不允许支付');
    }
    const res = await request(`/orders/${orderId}/pay`, {
      method: 'PATCH',
      body: { payMethod },
    });
    if (!res.ok) {
      throw new Error('支付失败');
    }
    order.status = ORDER_STATUS.PAID;
    order.payTime = new Date().toLocaleString();
    order.payMethod = payMethod;
    return true;
  }

  async shipOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (!order || order.status !== ORDER_STATUS.PAID) {
      throw new Error('订单状态不允许发货');
    }
    const res = await request(`/orders/${orderId}/ship`, { method: 'PATCH' });
    if (!res.ok) {
      throw new Error('发货失败');
    }
    order.status = ORDER_STATUS.SHIPPED;
    return true;
  }

  async completeOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (!order || order.status !== ORDER_STATUS.SHIPPED) {
      throw new Error('订单状态不允许完成');
    }
    const res = await request(`/orders/${orderId}/complete`, { method: 'PATCH' });
    if (!res.ok) {
      throw new Error('操作失败');
    }
    order.status = ORDER_STATUS.COMPLETED;
    return true;
  }

  async closeOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (!order) {
      throw new Error('订单不存在');
    }
    const res = await request(`/orders/${orderId}/close`, { method: 'PATCH' });
    if (!res.ok) {
      throw new Error('关闭订单失败');
    }
    order.status = ORDER_STATUS.CLOSED;
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

  getOrdersByUserId(userId) {
    const key = String(userId);
    return this.list
      .filter((o) => o.userAccount === key || String(o.userId) === key)
      .sort((a, b) => b.id - a.id);
  }

  async cancelOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (!order || order.status !== ORDER_STATUS.UNPAID) {
      throw new Error('订单状态不允许取消');
    }
    const res = await request(`/orders/${orderId}/cancel`, { method: 'PATCH' });
    if (!res.ok) {
      throw new Error('取消订单失败');
    }
    order.status = ORDER_STATUS.CLOSED;
    return true;
  }

  getAllOrders() {
    return [...this.list].sort((a, b) => b.id - a.id);
  }

  async deleteOrder(orderId) {
    const numId = Number(orderId);
    await request(`/orders/${numId}`, { method: 'DELETE' });
    this.list = this.list.filter((o) => o.id !== numId);
  }
}

const orderService = new OrderService();
export default orderService;
