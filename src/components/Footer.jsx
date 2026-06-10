import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="footer-logo">轻量商城</h4>
            <p className="footer-desc">轻量化电商平台 · 第四次大作业<br />精选好物，品质生活。</p>
          </div>
          <div className="footer-col">
            <h4>快速链接</h4>
            <Link to="/">首页</Link>
            <Link to="/category">全部分类</Link>
            <Link to="/cart">购物车</Link>
          </div>
          <div className="footer-col">
            <h4>关于我们</h4>
            <span>关于轻量商城</span>
            <span>用户协议</span>
            <span>隐私政策</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span><Heart size={12} /> Made with React</span>
          <span>LW-01-13 Team</span>
        </div>
      </div>
    </footer>
  );
}
