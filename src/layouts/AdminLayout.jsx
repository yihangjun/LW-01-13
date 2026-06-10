import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ServiceContext } from '../contexts/ServiceContext';
import '../pages/admin/Admin.css';

const menuItems = [
  { path: '/admin/goods', label: '商品', icon: '📦', permission: 'goods', crumb: '商品列表' },
  { path: '/admin/categories', label: '分类', icon: '📂', permission: 'categories', crumb: '分类管理' },
  { path: '/admin/orders', label: '订单', icon: '📋', permission: 'orders', crumb: '订单列表' },
  { path: '/admin/roles', label: '权限', icon: '🔐', permission: 'roles', crumb: '角色与用户' },
];

const AdminLayout = () => {
  const { admin } = useContext(ServiceContext);
  const navigate = useNavigate();
  const location = useLocation();
  const session = admin.getSession();

  useEffect(() => {
    if (!session) {
      navigate('/admin/login', { replace: true });
    }
  }, [session, navigate]);

  if (!session) return null;

  const current = menuItems.find((m) => location.pathname.startsWith(m.path));
  const visibleMenu = menuItems.filter((m) => admin.hasPermission(m.permission));

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__logo">🏪</span>
          <div>
            <strong>mall-admin-web</strong>
            <small>后台管理系统</small>
          </div>
        </div>
        <nav className="admin-nav">
          {visibleMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav__item${location.pathname === item.path ? ' admin-nav__item--active' : ''}`}
            >
              <span className="admin-nav__icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <p>{session.name}</p>
          <small>{session.roleName}</small>
          <button
            type="button"
            className="admin-sidebar__logout"
            onClick={() => {
              admin.logout();
              navigate('/admin/login');
            }}
          >
            退出登录
          </button>
        </div>
      </aside>

      <div className="admin-body">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <span>首页</span>
            <span>/</span>
            <span>{current?.label || '后台'}</span>
            {current?.crumb && (
              <>
                <span>/</span>
                <span className="admin-breadcrumb__current">{current.crumb}</span>
              </>
            )}
          </div>
          <div className="admin-topbar__user">{session.name}</div>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
