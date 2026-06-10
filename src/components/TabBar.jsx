import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/', label: '首页', icon: '🏠', end: true },
  { path: '/category', label: '分类', icon: '📂' },
  { path: '/cart', label: '购物车', icon: '🛒' },
  { path: '/my', label: '我的', icon: '👤' },
];

const TabBar = () => {
  return (
    <nav className="tab-bar" aria-label="主导航">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.end}
          className={({ isActive }) =>
            isActive ? 'tab-bar__item tab-bar__item--active' : 'tab-bar__item'
          }
        >
          <span className="tab-bar__icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default TabBar;
