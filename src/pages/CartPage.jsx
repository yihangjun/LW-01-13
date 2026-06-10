import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingCart, ChevronRight } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { ServiceContext } from "../contexts/ServiceContext";
import GoodImage from "../components/GoodImage";
import { formatPrice } from "../utils/format";
import "./CartPage.css";

export default function CartPage() {
  const { items, totalCount, selectedItems, selectedCount, removeFromCart, updateCount, toggleSelected, toggleAll, clearSelected } = useCart();
  const services = useContext(ServiceContext);
  const navigate = useNavigate();

  const allSelected = items.length > 0 && items.every(i => i.selected);
  const cartGoods = items.map(item => {
    const good = services.good.getGoodById(item.goodId);
    return { ...item, good };
  }).filter(item => item.good);

  const selectedGoods = cartGoods.filter(i => i.selected);
  const totalPrice = selectedGoods.reduce((sum, i) => sum + (i.good?.price || 0) * i.count, 0);

  const handleCheckout = () => {
    if (selectedCount === 0) return;
    localStorage.setItem("checkoutItems", JSON.stringify(selectedGoods.map(i => ({ goodId: i.goodId, count: i.count }))));
    navigate("/create-order");
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty container">
        <ShoppingCart size={48} />
        <h2>购物车是空的</h2>
        <p>快去挑选心仪的商品吧</p>
        <Link to="/" className="cart-go-shop">去逛逛</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="cart-title">
        购物车 <span className="cart-count">{totalCount} 件</span>
      </h1>

      <div className="cart-layout">
        <div className="cart-list">
          <div className="cart-select-all" onClick={() => toggleAll(!allSelected)}>
            <input type="checkbox" checked={allSelected} onChange={() => {}} />
            <span>全选</span>
          </div>

          {cartGoods.map(item => (
            <div key={item.goodId} className={`cart-item ${item.selected ? "selected" : ""}`}>
              <input
                type="checkbox"
                className="cart-item-check"
                checked={item.selected}
                onChange={() => toggleSelected(item.goodId)}
              />
              <Link to={`/detail/${item.goodId}`} className="cart-item-img">
                <GoodImage good={item.good} />
              </Link>
              <div className="cart-item-info">
                <Link to={`/detail/${item.goodId}`} className="cart-item-name">
                  {item.good?.name}
                </Link>
                <span className="cart-item-price">{formatPrice(item.good?.price)}</span>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateCount(item.goodId, item.count - 1)} disabled={item.count <= 1}>
                  <Minus size={14} />
                </button>
                <span>{item.count}</span>
                <button onClick={() => updateCount(item.goodId, item.count + 1)}>
                  <Plus size={14} />
                </button>
              </div>
              <div className="cart-item-subtotal">
                {formatPrice((item.good?.price || 0) * item.count)}
              </div>
              <button className="cart-item-remove" onClick={() => removeFromCart(item.goodId)} title="删除">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>已选 {selectedCount} 件</span>
            <span>合计</span>
          </div>
          <div className="cart-summary-total">{formatPrice(totalPrice)}</div>
          <button
            className="cart-checkout-btn"
            disabled={selectedCount === 0}
            onClick={handleCheckout}
          >
            去结算 <ChevronRight size={18} />
          </button>
          {selectedCount > 0 && (
            <button className="cart-clear-btn" onClick={clearSelected}>
              <Trash2 size={14} /> 清空选中
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
