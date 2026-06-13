import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3x3, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import './BottomNav.css';

export default function BottomNav() {
  const location = useLocation();
  const { totalCount } = useCart();
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={24} />
        <span>首页</span>
      </Link>
      
      <Link to="/category" className={`bottom-nav-item ${isActive('/category') ? 'active' : ''}`}>
        <Grid3x3 size={24} />
        <span>分类</span>
      </Link>
      
      <Link to="/cart" className={`bottom-nav-item ${isActive('/cart') ? 'active' : ''}`}>
        <div className="cart-icon-wrapper">
          <ShoppingCart size={24} />
          {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
        </div>
        <span>购物车</span>
      </Link>
      
      <Link to="/user" className={`bottom-nav-item ${isActive('/user') ? 'active' : ''}`}>
        <User size={24} />
        <span>个人</span>
      </Link>
    </nav>
  );
}
