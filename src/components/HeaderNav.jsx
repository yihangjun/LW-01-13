import { NavLink, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const navItems = [
  { path: '/', label: '首页', end: true },
  { path: '/category', label: '分类' },
  { path: '/cart', label: '购物车' },
  { path: '/my', label: '我的' },
];

const HeaderNav = () => {
  const { isLoggedIn, user } = useUser();

  return (
    <header className="header-nav">
      <div className="header-nav__inner">
        <Link to="/" className="header-nav__logo">商城系统</Link>
        <nav className="header-nav__links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'header-nav__link header-nav__link--active' : 'header-nav__link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-nav__user">
          {isLoggedIn ? (
            <Link to="/my">{user.nickname}</Link>
          ) : (
            <Link to="/login">登录</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
