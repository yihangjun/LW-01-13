import { Link } from 'react-router-dom';
import './LoginPage.css';

const ForgotPasswordPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">忘记密码</h1>
        <p className="auth-card__hint">
          本作业为前端模拟项目，暂不支持找回密码。请使用「获取体验账号」或注册新账号。
        </p>
        <Link to="/login" className="auth-btn auth-btn--primary auth-btn--link">
          返回登录
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
