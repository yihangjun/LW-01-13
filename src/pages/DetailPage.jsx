import { useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ServiceContext } from '../contexts/ServiceContext';
import { useUser } from '../contexts/UserContext';
import ProductThumb from '../components/ProductThumb';
import './DetailPage.css';

const DetailPage = () => {
  const { goodId } = useParams();
  const { good, cart } = useContext(ServiceContext);
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const product = good.getGoodById(goodId);

  if (!product) {
    return (
      <div className="detail-page">
        <p>商品不存在</p>
        <Link to="/">返回首页</Link>
      </div>
    );
  }

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const requireLogin = (action) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    action();
  };

  const addToCart = () => {
    cart.addItem(product.id);
    showToast('已加入购物车');
  };

  return (
    <div className="detail-page">
      {toast && <div className="detail-toast">{toast}</div>}
      <div className="detail-page__body">
        <div className="detail-hero">
          <ProductThumb product={product} className="detail-hero__thumb" />
          {product.isNew && <span className="detail-hero__badge">新品</span>}
        </div>
        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="detail-price">¥{product.price}</p>
          <p className="detail-spec">规格：{product.spec}</p>
          <p className="detail-brand">品牌：{product.brand}</p>
          <p className="detail-desc">
            高性能旗舰机型，作业演示商品。支持加入购物车与立即购买完整流程。
          </p>
        </div>
      </div>
      <div className="detail-footer">
        <button type="button" className="detail-footer__icon" title="客服">💬</button>
        <Link to="/cart" className="detail-footer__icon" title="购物车">🛒</Link>
        <button
          type="button"
          className="detail-footer__cart"
          onClick={() => requireLogin(addToCart)}
        >
          加入购物车
        </button>
        <button
          type="button"
          className="detail-footer__buy"
          onClick={() => requireLogin(() => navigate(`/create-order/${product.id}`))}
        >
          立即购买
        </button>
      </div>
    </div>
  );
};

export default DetailPage;
