import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { useMallAuth } from '../hooks/useMallAuth';
import { useCart } from '../contexts/CartContext';
import SearchBar from './SearchBar';
import './Header.css';

export default function Header() {
  const { user, logout } = useMallAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="header-logo">
          <Package size={24} />
          <span>轻量商城</span>
        </Link>

        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>首页</Link>
          <Link to="/category" className="nav-link" onClick={() => setMobileMenuOpen(false)}>分类</Link>
          {user && (
            <Link to="/order-list" className="nav-link" onClick={() => setMobileMenuOpen(false)}>订单</Link>
          )}
          {/* 移动端隐藏的购物车和个人入口 */}
          <div className="mobile-nav-extras">
            <Link to="/cart" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <ShoppingCart size={20} />
              <span>购物车</span>
              {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/user" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <User size={20} />
                  <span>个人中心</span>
                </Link>
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>退出登录</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link login-btn" onClick={() => setMobileMenuOpen(false)}>
                登录 / 注册
              </Link>
            )}
          </div>
        </nav>

        <div className="header-actions">
          <div className="header-search-desktop">
            <SearchBar />
          </div>
          <button className="header-icon-btn search-mobile-btn" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20} />
          </button>
          <Link to="/cart" className="header-icon-btn cart-btn">
            <ShoppingCart size={20} />
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>
          {user ? (
            <div className="header-user-menu">
              <Link to="/user" className="header-icon-btn">
                <User size={20} />
              </Link>
              <button className="header-icon-btn" onClick={handleLogout} title="退出登录">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="header-login-btn">登录</Link>
          )}
          <button className="header-icon-btn mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="header-search-mobile">
          <SearchBar onSearch={() => setSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
