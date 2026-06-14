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
  {
    id: 'category_mgr',
    name: '分类专员',
    permissions: ['categories'],
  },
  {
    id: 'ops_dev',
    name: '技术运营',
    permissions: ['goods', 'categories', 'orders'],
  },
];

export const DEFAULT_ADMIN_USERS = [
  { username: 'admin', password: 'admin123', name: '周一航', roleId: 'admin' },
  { username: 'luduxing', password: '123456', name: '罗督星', roleId: 'operator' },
  { username: 'zhangzhe', password: '123456', name: '张喆', roleId: 'product' },
  { username: 'zhourui', password: '123456', name: '周锐', roleId: 'ops_dev' },
  { username: 'wangyixiao', password: '123456', name: '王艺晓', roleId: 'category_mgr' },
  { username: 'operator', password: '123456', name: '运营小李', roleId: 'operator' },
  { username: 'product01', password: '123456', name: '商品小刘', roleId: 'product' },
  { username: 'order01', password: '123456', name: '订单小陈', roleId: 'operator' },
];

export const GOODS_TAG_HELP = {
  onSale: '上架：开启后商品在前台商城可见并可购买',
  isRecommended: '推荐：开启后进入首页热门/推荐区域',
};
