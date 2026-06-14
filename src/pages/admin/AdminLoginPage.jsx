import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceContext } from '../../contexts/ServiceContext';
import './Admin.css';

const AdminLoginPage = () => {
  const { admin } = useContext(ServiceContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  const goAfterLogin = (user) => {
    const perms = user.permissions;
    const target = perms.includes('goods') ? '/admin/goods'
      : perms.includes('orders') ? '/admin/orders'
      : '/admin/categories';
    navigate(target, { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await admin.login(username, password);
    if (result.ok) {
      goAfterLogin(result.user);
    } else {
      setError(result.message);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setDemoLoading(true);
    const demo = admin.getDemoAccount();
    const result = await admin.login(demo.username, demo.password);
    setDemoLoading(false);
    if (result.ok) {
      goAfterLogin(result.user);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="admin-auth-layout">
      <aside className="admin-auth-brand">
        <div className="admin-auth-brand__inner">
          <span className="admin-auth-brand__icon">🏪</span>
          <h1>mall-admin-web</h1>
          <p>后台管理系统：商品、分类、订单与权限管理</p>
        </div>
      </aside>
      <main className="admin-auth-main">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <h2 className="admin-login-card__title">管理员登录</h2>
          <div className="admin-field">
            <span className="admin-field__icon">👤</span>
            <input
              className="admin-field__input"
              placeholder="请输入管理员账号"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="admin-field">
            <span className="admin-field__icon">🔒</span>
            <input
              className="admin-field__input"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="admin-btn admin-btn--block">登录</button>
          <button
            type="button"
            className="admin-btn admin-btn--outline admin-btn--block"
            onClick={handleDemoLogin}
            disabled={demoLoading}
          >
            {demoLoading ? '正在登录…' : '使用体验账号登录'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminLoginPage;
