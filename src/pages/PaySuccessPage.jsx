import { Link, useParams } from 'react-router-dom';
import './OrderFlow.css';

const PaySuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="order-flow-page">
      <div className="order-flow order-flow--center">
        <div className="pay-success-icon">✓</div>
        <h2>支付成功</h2>
        <p className="order-card__muted">订单已支付，等待商家发货</p>
        <div className="pay-success-actions">
          <Link to={`/order-detail/${orderId}`} className="order-submit-bar__btn">查看订单</Link>
          <Link to="/" className="pay-success-link">返回首页</Link>
        </div>
      </div>
    </div>
  );
};

export default PaySuccessPage;
