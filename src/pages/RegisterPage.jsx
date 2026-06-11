import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './LoginPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    const result = await register(username, password);
    if (result.ok) {
      setSuccess(result.message);
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__decor auth-page__decor--green" />
      <div className="auth-page__decor auth-page__decor--purple" />

      <div className="auth-card">
        <h1 className="auth-card__title">注册账号</h1>

        <form className="auth-form" onSubmit={handleRegister}>
          <label className="auth-field">
            <span className="auth-field__label">用户名</span>
            <input
              className="auth-field__input"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span className="auth-field__label">密码</span>
            <input
              className="auth-field__input"
              type="password"
              placeholder="至少 6 位"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span className="auth-field__label">确认密码</span>
            <input
              className="auth-field__input"
              type="password"
              placeholder="再次输入密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}
          {success && <p className="auth-form__success">{success}</p>}

          <button type="submit" className="auth-btn auth-btn--primary">
            注册
          </button>
        </form>

        <p className="auth-footer">
          已有账号？
          <Link to="/login" className="auth-link">返回登录</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
