import { defaultCategories } from '../mock/categories';

export const GOODS_VERSION = '7';

const DEMO_USER = {
  username: 'member',
  password: '123456',
  nickname: 'member',
};

export function initAppData() {
  if (localStorage.getItem('goodListVersion') !== GOODS_VERSION) {
    localStorage.removeItem('goodList');
    localStorage.setItem('goodListVersion', GOODS_VERSION);
  }

  const users = JSON.parse(localStorage.getItem('mall_users') || '[]');
  if (!users.some((u) => u.username === DEMO_USER.username)) {
    users.push(DEMO_USER);
    localStorage.setItem('mall_users', JSON.stringify(users));
  }

  if (!localStorage.getItem('categoryList')) {
    localStorage.setItem('categoryList', JSON.stringify(defaultCategories));
  }

  if (!localStorage.getItem('cartList') && localStorage.getItem('cartItems')) {
    localStorage.setItem('cartList', localStorage.getItem('cartItems'));
    localStorage.removeItem('cartItems');
  }
}
