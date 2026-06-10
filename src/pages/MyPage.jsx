import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './MyPage.css';

const orderTabs = [
  { label: '全部订单', path: '/order-list', status: '' },
  { label: '待付款', path: '/order-list?status=0' },
  { label: '待收货', path: '/order-list?status=2' },
  { label: '退款/售后', path: '/order-list?status=4' },
];

const menuItems = [
  { label: '地址管理', path: '/my/address' },
  { label: '我的足迹', path: '/my/footprint' },
  { label: '我的关注', path: '/my/follows' },
  { label: '我的收藏', path: '/my/favorites' },
  { label: '我的评价', path: '/my/reviews' },
];

const MyPage = () => {
  const { user, isLoggedIn, logout } = useUser();

  if (!isLoggedIn) {
    return (
      <div className="page page--center">
        <p className="page__desc">登录后查看个人信息与订单</p>
        <Link to="/login" className="page__action-btn">去登录</Link>
      </div>
    );
  }

  return (
    <div className="mall-page my-page">
      <div className="my-banner">
        <div className="my-banner__top">
          <Link to="/my/settings" className="my-banner__icon">⚙️</Link>
          <span className="my-banner__icon">🔔</span>
        </div>
        <div className="my-profile">
          <div className="my-profile__avatar">{user.nickname[0]}</div>
          <div>
            <p className="my-profile__name">{user.nickname}</p>
            <span className="my-profile__badge">黄金会员</span>
          </div>
        </div>
        <div className="my-stats">
          <div><strong>5000</strong><span>积分</span></div>
          <div><strong>1000</strong><span>成长值</span></div>
          <div><strong>暂无</strong><span>优惠券</span></div>
        </div>
      </div>
      <div className="my-orders">
        {orderTabs.map((tab) => (
          <Link key={tab.label} to={tab.path} className="my-orders__item">
            {tab.label}
          </Link>
        ))}
      </div>
      <ul className="my-menu">
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link to={item.path} className="my-menu__item">
              <span>{item.label}</span>
              <span>›</span>
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" className="my-logout" onClick={logout}>退出登录</button>
      <Link to="/admin/login" className="my-admin-link">后台管理入口</Link>
    </div>
  );
};

export default MyPage;
