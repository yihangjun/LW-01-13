import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithDemo } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const result = login(username, password);
    if (result.ok) {
      navigate('/my', { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setDemoLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = loginWithDemo();
    setDemoLoading(false);
    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-layout">
      <aside className="auth-brand">
        <div className="auth-brand__inner">
          <span className="auth-brand__logo">商城系统</span>
          <h2 className="auth-brand__title">轻量化电商平台</h2>
          <p className="auth-brand__desc">
            登录后可使用购物车、下单、支付完整流程。无需注册即可一键体验演示账号。
          </p>
          <ul className="auth-brand__features">
            <li>商品浏览与搜索</li>
            <li>购物车与订单管理</li>
            <li>模拟支付全链路</li>
          </ul>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <p className="auth-card__subtitle">LOGIN</p>
          <h1 className="auth-card__title">欢迎回来！</h1>

          <form className="auth-form" onSubmit={handleLogin}>
            <label className="auth-field">
              <span className="auth-field__label">用户名</span>
              <input
                className="auth-field__input"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="auth-field">
              <span className="auth-field__label">密码</span>
              <input
                className="auth-field__input"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>

            {error && <p className="auth-form__error">{error}</p>}

            <button type="submit" className="auth-btn auth-btn--primary">
              登录
            </button>

            <button
              type="button"
              className="auth-btn auth-btn--demo"
              onClick={handleDemoLogin}
              disabled={demoLoading}
            >
              {demoLoading ? '正在登录…' : '使用体验账号登录'}
            </button>
            <p className="auth-form__demo-note">
              体验账号为系统预设访客，点击即可直接进入商城
            </p>
          </form>

          <Link to="/forgot-password" className="auth-link auth-link--center">
            忘记密码？
          </Link>

          <p className="auth-footer">
            还没有账号？
            <Link to="/register" className="auth-link">马上注册</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
