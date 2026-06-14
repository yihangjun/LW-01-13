export const GOODS_VERSION = '10';

export const defaultCategories = [
  {
    id: '1',
    name: '服装',
    children: [
      { id: '1-1', name: '男装' },
      { id: '1-2', name: '女装' },
      { id: '1-3', name: '童装' },
    ],
  },
  {
    id: '2',
    name: '手机数码',
    children: [
      { id: '2-1', name: '手机' },
      { id: '2-2', name: '平板' },
      { id: '2-3', name: '配件' },
    ],
  },
  {
    id: '3',
    name: '家用电器',
    children: [
      { id: '3-1', name: '厨房电器' },
      { id: '3-2', name: '生活电器' },
    ],
  },
  {
    id: '4',
    name: '家具家装',
    children: [
      { id: '4-1', name: '厨卫卫浴' },
      { id: '4-2', name: '灯饰照明' },
      { id: '4-3', name: '五金工具' },
      { id: '4-4', name: '卧室家具' },
      { id: '4-5', name: '客厅家具' },
    ],
  },
  {
    id: '5',
    name: '汽车用品',
    children: [
      { id: '5-1', name: '内饰用品' },
      { id: '5-2', name: '车外装饰' },
    ],
  },
  {
    id: '6',
    name: '电脑办公',
    children: [
      { id: '6-1', name: '笔记本' },
      { id: '6-2', name: '台式机' },
      { id: '6-3', name: '办公设备' },
    ],
  },
];

export const defaultGoods = [
  { id: 1, name: '小米 12 Pro', price: 2999, categoryId: '2-1', brand: '小米', sku: 'MI12P-128', stock: 100, isHot: true, onSale: true, isNew: true, isRecommended: true, sort: 1, sales: 256, auditStatus: '未审核', color: '#ff9a76', spec: '黑色 128G', imgUrl: '/images/xiaomi12pro.png' },
  { id: 2, name: '华为 Mate 70', price: 5499, categoryId: '2-1', brand: '华为', sku: 'HW70-256', stock: 80, isHot: true, onSale: true, isNew: false, isRecommended: true, sort: 2, sales: 189, auditStatus: '未审核', color: '#6b8cff', spec: '白色 256G', imgUrl: '/images/huawei-mate70.png' },
  { id: 3, name: '苹果 iPhone 16', price: 6999, categoryId: '2-1', brand: 'Apple', sku: 'IP16-128', stock: 60, isHot: true, onSale: false, isNew: true, isRecommended: true, sort: 3, sales: 320, auditStatus: '未审核', color: '#a8e6cf', spec: '原色 128G', imgUrl: '/images/iphone16.png' },
  { id: 4, name: '联想笔记本电脑', price: 4599, categoryId: '6-1', brand: '联想', sku: 'LN-4599', stock: 45, isHot: true, onSale: true, isNew: false, isRecommended: false, sort: 4, sales: 98, auditStatus: '未审核', color: '#ffd3b6', spec: '16G 512G', imgUrl: '/images/lenovo-laptop.png' },
  { id: 5, name: '戴森吹风机', price: 2890, categoryId: '3-2', brand: '戴森', sku: 'DY-2890', stock: 30, isHot: false, onSale: true, isNew: false, isRecommended: false, sort: 5, sales: 67, auditStatus: '未审核', color: '#dcedc1', spec: '紫红色', imgUrl: '/images/dyson-supersonic.png' },
  { id: 6, name: '耐克运动鞋', price: 699, categoryId: '1-1', brand: '耐克', sku: 'NK-699', stock: 200, isHot: true, onSale: true, isNew: true, isRecommended: true, sort: 6, sales: 512, auditStatus: '未审核', color: '#ffaaa5', spec: '42码 黑色', imgUrl: '/images/nike-shoes.png' },
  { id: 7, name: '索尼 WH-1000XM5 降噪耳机', price: 2299, categoryId: '2-3', brand: '索尼', sku: 'SONY-XM5', stock: 55, isHot: true, onSale: true, isNew: true, isRecommended: true, sort: 7, sales: 178, auditStatus: '未审核', color: '#b8a9d6', spec: '铂金银', originalPrice: 2999, imgUrl: '/images/sony-wh1000xm5.png' },
  { id: 8, name: 'iPad Air M3', price: 4799, categoryId: '2-2', brand: 'Apple', sku: 'IPAIR-M3-128', stock: 40, isHot: true, onSale: true, isNew: true, isRecommended: true, sort: 8, sales: 234, auditStatus: '未审核', color: '#87ceeb', spec: '10.9寸 128G', originalPrice: 5499, imgUrl: '/images/ipad-air-m3.png' },
  { id: 9, name: '海尔节能冰箱 450L', price: 3299, categoryId: '3-1', brand: '海尔', sku: 'HR-450', stock: 35, isHot: true, onSale: true, isNew: false, isRecommended: false, sort: 9, sales: 89, auditStatus: '未审核', color: '#b0e0e6', spec: '450升 双变频', imgUrl: '/images/haier-fridge.png' },
  { id: 10, name: '美的变频空调 1.5匹', price: 2699, categoryId: '3-2', brand: '美的', sku: 'MD-KT15', stock: 50, isHot: true, onSale: true, isNew: false, isRecommended: true, sort: 10, sales: 156, auditStatus: '未审核', color: '#98fb98', spec: '1.5匹 冷暖', imgUrl: '/images/midea-ac.png' },
  { id: 11, name: '戴尔 Inspiron 台式机', price: 5499, categoryId: '6-2', brand: '戴尔', sku: 'DL-INS', stock: 25, isHot: false, onSale: true, isNew: true, isRecommended: false, sort: 11, sales: 45, auditStatus: '未审核', color: '#dda0dd', spec: '16G 512G SSD', originalPrice: 6299, imgUrl: '/images/dell-inspiron.png' },
  { id: 12, name: '罗技 MX Keys 机械键盘', price: 699, categoryId: '6-3', brand: '罗技', sku: 'LT-MXK', stock: 120, isHot: true, onSale: true, isNew: false, isRecommended: true, sort: 12, sales: 312, auditStatus: '未审核', color: '#f0e68c', spec: '无线 茶轴', imgUrl: '/images/mx-keys.png' },
  { id: 13, name: '李宁超轻跑鞋 赤兔', price: 399, categoryId: '1-1', brand: '李宁', sku: 'LN-CT', stock: 180, isHot: true, onSale: true, isNew: true, isRecommended: true, sort: 13, sales: 467, auditStatus: '未审核', color: '#ffb6c1', spec: '41码 黑红', originalPrice: 499, imgUrl: '/images/lining-chitu.png' },
  { id: 14, name: '优衣库纯棉圆领T恤', price: 99, categoryId: '1-2', brand: '优衣库', sku: 'UN-T99', stock: 300, isHot: false, onSale: true, isNew: false, isRecommended: false, sort: 14, sales: 1023, auditStatus: '未审核', color: '#e0e0e0', spec: 'S/M/L 多色', imgUrl: '/images/uniqlo-tshirt.png' },
  { id: 15, name: '芝华仕头等舱沙发', price: 5999, categoryId: '4-5', brand: '芝华仕', sku: 'ZHS-SF', stock: 15, isHot: true, onSale: true, isNew: false, isRecommended: true, sort: 15, sales: 67, auditStatus: '未审核', color: '#deb887', spec: '真皮 三位', imgUrl: '/images/cheers-sofa.png' },
  { id: 16, name: '欧普吸顶灯 智能款', price: 299, categoryId: '4-2', brand: '欧普', sku: 'OP-LED', stock: 90, isHot: false, onSale: true, isNew: true, isRecommended: false, sort: 16, sales: 234, auditStatus: '未审核', color: '#ffe4b5', spec: '36W 遥控调光', imgUrl: '/images/opple-light.png' },
  { id: 17, name: '飞利浦电动剃须刀 S5588', price: 599, categoryId: '3-2', brand: '飞利浦', sku: 'PH-S5588', stock: 70, isHot: false, onSale: true, isNew: false, isRecommended: true, sort: 17, sales: 189, auditStatus: '未审核', color: '#afeeee', spec: '三刀头 全身水洗', imgUrl: '/images/philips-s5588.png' },
  { id: 18, name: '嘉实多全合成机油 4L', price: 358, categoryId: '5-1', brand: '嘉实多', sku: 'CSD-4L', stock: 200, isHot: false, onSale: true, isNew: false, isRecommended: false, sort: 18, sales: 521, auditStatus: '未审核', color: '#d2b48c', spec: '5W-30', imgUrl: '/images/castrol-oil.png' },
  { id: 19, name: '70迈智能行车记录仪', price: 449, categoryId: '5-2', brand: '70迈', sku: '70M-DVR', stock: 85, isHot: true, onSale: true, isNew: true, isRecommended: true, sort: 19, sales: 298, auditStatus: '未审核', color: '#4169e1', spec: '4K 超清夜视', imgUrl: '/images/70mai-dashcam.png' },
  { id: 20, name: '得力黑白激光打印机', price: 1299, categoryId: '6-3', brand: '得力', sku: 'DL-LP', stock: 60, isHot: false, onSale: true, isNew: false, isRecommended: false, sort: 20, sales: 112, auditStatus: '未审核', color: '#c0c0c0', spec: 'A4 自动双面', originalPrice: 1499, imgUrl: '/images/deli-printer.png' },
];

export const defaultAdminRoles = [
  { id: 'admin', name: '超级管理员', permissions: ['goods', 'categories', 'orders', 'roles'] },
  { id: 'operator', name: '运营人员', permissions: ['orders'] },
  { id: 'product', name: '商品运营', permissions: ['goods', 'categories'] },
  { id: 'category_mgr', name: '分类专员', permissions: ['categories'] },
  { id: 'ops_dev', name: '技术运营', permissions: ['goods', 'categories', 'orders'] },
];

export const defaultAdminUsers = [
  { username: 'admin', password: 'admin123', name: '周一航', roleId: 'admin' },
  { username: 'luduxing', password: '123456', name: '罗督星', roleId: 'operator' },
  { username: 'zhangzhe', password: '123456', name: '张喆', roleId: 'product' },
  { username: 'zhourui', password: '123456', name: '周锐', roleId: 'ops_dev' },
  { username: 'wangyixiao', password: '123456', name: '王艺晓', roleId: 'category_mgr' },
  { username: 'operator', password: '123456', name: '运营小李', roleId: 'operator' },
  { username: 'product01', password: '123456', name: '商品小刘', roleId: 'product' },
  { username: 'order01', password: '123456', name: '订单小陈', roleId: 'operator' },
];

export const defaultUsers = [
  {
    username: 'member',
    password: '123456',
    nickname: '会员小明',
    phone: '13800138001',
    address: '上海市浦东新区世纪大道 100 号',
  },
  {
    username: 'zhangwei',
    password: '123456',
    nickname: '张伟',
    phone: '13800138002',
    address: '北京市海淀区中关村大街 1 号',
  },
  {
    username: 'lina',
    password: '123456',
    nickname: '李娜',
    phone: '13800138003',
    address: '广州市天河区体育西路 88 号',
  },
  {
    username: 'wangfang',
    password: '123456',
    nickname: '王芳',
    phone: '13800138004',
    address: '深圳市南山区科技园南路 16 号',
  },
  {
    username: 'liuqiang',
    password: '123456',
    nickname: '刘强',
    phone: '13800138005',
    address: '杭州市西湖区文三路 200 号',
  },
  {
    username: 'chenjing',
    password: '123456',
    nickname: '陈静',
    phone: '13800138006',
    address: '成都市武侯区天府大道 666 号',
  },
];

export const defaultOrders = [
  {
    id: 1,
    orderNo: '202506100001',
    userAccount: 'member',
    items: [{ goodId: 6, count: 1, price: 699 }],
    address: {
      name: '会员小明',
      phone: '13800138001',
      detail: '上海市浦东新区世纪大道 100 号',
    },
    total: 699,
    status: 1,
    createTime: '2025-06-10 14:30:00',
    payTime: '2025-06-10 14:32:00',
    payMethod: 'alipay',
    source: 'APP订单',
  },
  {
    id: 2,
    orderNo: '202506110002',
    userAccount: 'zhangwei',
    items: [{ goodId: 7, count: 1, price: 2299 }],
    address: {
      name: '张伟',
      phone: '13800138002',
      detail: '北京市海淀区中关村大街 1 号',
    },
    total: 2299,
    status: 2,
    createTime: '2025-06-11 09:15:00',
    payTime: '2025-06-11 09:18:00',
    payMethod: 'wechat',
    source: 'APP订单',
  },
  {
    id: 3,
    orderNo: '202506120003',
    userAccount: 'lina',
    items: [{ goodId: 8, count: 1, price: 4799 }],
    address: {
      name: '李娜',
      phone: '13800138003',
      detail: '广州市天河区体育西路 88 号',
    },
    total: 4799,
    status: 0,
    createTime: '2025-06-12 20:45:00',
    payTime: null,
    payMethod: null,
    source: 'APP订单',
  },
  {
    id: 4,
    orderNo: '202506130004',
    userAccount: 'wangfang',
    items: [{ goodId: 13, count: 2, price: 399 }],
    address: {
      name: '王芳',
      phone: '13800138004',
      detail: '深圳市南山区科技园南路 16 号',
    },
    total: 798,
    status: 3,
    createTime: '2025-06-13 11:20:00',
    payTime: '2025-06-13 11:22:00',
    payMethod: 'alipay',
    source: 'APP订单',
  },
  {
    id: 5,
    orderNo: '202506140005',
    userAccount: 'liuqiang',
    items: [{ goodId: 12, count: 1, price: 699 }, { goodId: 14, count: 3, price: 99 }],
    address: {
      name: '刘强',
      phone: '13800138005',
      detail: '杭州市西湖区文三路 200 号',
    },
    total: 996,
    status: 1,
    createTime: '2025-06-14 08:10:00',
    payTime: '2025-06-14 08:12:00',
    payMethod: 'wechat',
    source: 'APP订单',
  },
];

export function createSeedDb() {
  return {
    version: GOODS_VERSION,
    goods: defaultGoods.map((g) => ({ ...g })),
    categories: defaultCategories.map((c) => ({
      ...c,
      children: (c.children || []).map((ch) => ({ ...ch })),
    })),
    orders: defaultOrders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({ ...i })),
      address: { ...o.address },
    })),
    users: defaultUsers.map((u) => ({ ...u })),
    adminUsers: defaultAdminUsers.map((u) => ({ ...u })),
    adminRoles: defaultAdminRoles.map((r) => ({
      ...r,
      permissions: [...r.permissions],
    })),
    carts: {},
  };
}
