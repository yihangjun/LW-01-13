export const ORDER_STATUS = {
  UNPAID: 0,
  PAID: 1,
  SHIPPED: 2,
  COMPLETED: 3,
  CLOSED: 4,
};

export const ORDER_STATUS_TEXT = {
  0: '待付款',
  1: '待发货',
  2: '待收货',
  3: '已完成',
  4: '已关闭',
};

export const PAY_METHODS = [
  { id: 'alipay', name: '支付宝支付' },
  { id: 'wechat', name: '微信支付' },
];
