export const ADMIN_MODULES = [
  { key: 'goods', label: '商品管理', desc: '商品增删改查、上下架' },
  { key: 'categories', label: '分类管理', desc: '商品分类维护' },
  { key: 'orders', label: '订单管理', desc: '订单查询、发货' },
  { key: 'roles', label: '权限管理', desc: '角色与后台用户' },
];

export const DEFAULT_ROLES = [
  {
    id: 'admin',
    name: '超级管理员',
    permissions: ['goods', 'categories', 'orders', 'roles'],
  },
  {
    id: 'operator',
    name: '运营人员',
    permissions: ['orders'],
  },
  {
    id: 'product',
    name: '商品运营',
    permissions: ['goods', 'categories'],
  },
];

export const DEFAULT_ADMIN_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    roleId: 'admin',
  },
  {
    username: 'operator',
    password: '123456',
    name: '运营小王',
    roleId: 'operator',
  },
];

export const GOODS_TAG_HELP = {
  onSale: '上架：开启后商品在前台商城可见并可购买',
  isNew: '新品：开启后商品展示「新品」标识',
  isRecommended: '推荐：开启后进入首页热门/推荐区域',
};
