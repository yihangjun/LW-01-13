import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useToast } from "../components/Toast";

const CartContext = createContext(null);
const CART_KEY = 'cartList';

export function CartProvider({ children }) {
  const toast = useToast();
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((goodId, count = 1, good = null) => {
    const id = Number(goodId);
    let blocked = false;
    setItems(prev => {
      const existing = prev.find(i => Number(i.goodId) === id);
      const currentCount = existing ? existing.count : 0;
      if (good && good.stock != null && currentCount + count > good.stock) {
        blocked = true;
        return prev;
      }
      if (existing) {
        return prev.map(i => Number(i.goodId) === id ? { ...i, count: i.count + count } : i);
      }
      return [...prev, { goodId: id, count, selected: true }];
    });
    if (blocked) {
      toast("库存不足，最多可购买 " + (good ? good.stock : 0) + " 件", "warning");
      return false;
    }
    return true;
  }, []);

  const removeFromCart = useCallback((goodId) => {
    setItems(prev => prev.filter(i => i.goodId !== goodId));
  }, []);

  const updateCount = useCallback((goodId, count) => {
    if (count < 1) return;
    setItems(prev => prev.map(i => i.goodId === goodId ? { ...i, count } : i));
  }, []);

  const toggleSelected = useCallback((goodId) => {
    setItems(prev => prev.map(i => i.goodId === goodId ? { ...i, selected: !i.selected } : i));
  }, []);

  const toggleAll = useCallback((selected) => {
    setItems(prev => prev.map(i => ({ ...i, selected })));
  }, []);

  const clearSelected = useCallback(() => {
    setItems(prev => prev.filter(i => !i.selected));
  }, []);

  const totalCount = items.reduce((sum, i) => sum + i.count, 0);
  const selectedItems = items.filter(i => i.selected);
  const selectedCount = selectedItems.length;

  return (
    <CartContext.Provider value={{
      items,
      totalCount,
      selectedItems,
      selectedCount,
      addToCart,
      removeFromCart,
      updateCount,
      toggleSelected,
      toggleAll,
      clearSelected,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;
