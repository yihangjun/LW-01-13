import { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ServiceContext } from '../contexts/ServiceContext';
import { useRequireUser } from '../hooks/useRequireUser';
import ProductThumb from '../components/ProductThumb';
import './CartPage.css';

const CartPage = () => {
  const { cart, good } = useContext(ServiceContext);
  const navigate = useNavigate();
  const loggedIn = useRequireUser();
  const [, refresh] = useState(0);

  const items = useMemo(() => {
    return cart.getItems().map((item) => ({
      ...item,
      good: good.getGoodById(item.goodId),
    })).filter((i) => i.good);
  }, [cart, good, refresh]);

  if (!loggedIn) return null;

  const selected = items.filter((i) => i.selected);
  const total = selected.reduce((sum, i) => sum + i.good.price * i.count, 0);
  const allSelected = items.length > 0 && items.every((i) => i.selected);

  const checkout = () => {
    if (selected.length === 0) {
      alert('请选择要结算的商品');
      return;
    }
    navigate('/create-order/cart');
  };

  return (
    <div className="mall-page cart-page">
      <header className="mall-page__header">购物车</header>
      <div className="cart-list-wrap">
      {items.length === 0 ? (
        <p className="cart-empty">购物车空空如也</p>
      ) : (
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.goodId} className="cart-item">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => { cart.toggleSelect(item.goodId); refresh((n) => n + 1); }}
              />
              <ProductThumb product={item.good} className="cart-item__img" />
              <div className="cart-item__info">
                <p className="cart-item__name">{item.good.name}</p>
                <p className="cart-item__spec">{item.good.spec}</p>
                <p className="cart-item__price">¥{item.good.price}</p>
                <div className="cart-item__actions">
                  <button type="button" onClick={() => { cart.updateCount(item.goodId, item.count - 1); refresh((n) => n + 1); }}>-</button>
                  <span>{item.count}</span>
                  <button type="button" onClick={() => { cart.updateCount(item.goodId, item.count + 1); refresh((n) => n + 1); }}>+</button>
                  <button type="button" className="cart-item__delete" onClick={() => { cart.removeItem(item.goodId); refresh((n) => n + 1); }}>删除</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
      {items.length > 0 && (
        <div className="cart-footer">
          <div className="cart-footer__left">
            <label>
              <input type="checkbox" checked={allSelected} onChange={(e) => { cart.selectAll(e.target.checked); refresh((n) => n + 1); }} />
              全选
            </label>
            <button type="button" className="cart-footer__clear" onClick={() => { cart.clear(); refresh((n) => n + 1); }}>清空</button>
          </div>
          <div className="cart-footer__right">
            <span className="cart-footer__total">¥{total}</span>
            <button type="button" className="cart-footer__checkout" onClick={checkout}>去结算</button>
          </div>
        </div>
      )}
      <Link to="/" className="cart-back">继续购物</Link>
    </div>
  );
};

export default CartPage;
