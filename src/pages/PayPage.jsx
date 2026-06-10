import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ServiceContext } from '../contexts/ServiceContext';
import { PAY_METHODS } from '../constants/orderStatus';
import './OrderFlow.css';

const PayPage = () => {
  const { orderId } = useParams();
  const { order } = useContext(ServiceContext);
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState('alipay');
  const [countdown, setCountdown] = useState(60);
  const [paying, setPaying] = useState(false);

  const parsedOrderId = Number(orderId);
  const orderData = order.getOrderById(parsedOrderId);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  if (!orderData) {
    return (
      <div className="order-flow-page">
        <div className="order-flow order-flow--center">
          <p>订单不存在</p>
          <button type="button" className="order-submit-bar__btn" onClick={() => navigate('/')}>返回首页</button>
        </div>
      </div>
    );
  }

  const confirmPay = () => {
    if (paying) return;
    setPaying(true);
    setTimeout(() => {
      const ok = order.payOrder(parsedOrderId, payMethod);
      setPaying(false);
      if (ok) {
        navigate(`/pay-success/${parsedOrderId}`);
      } else {
        alert('支付失败，请重试');
      }
    }, 1800);
  };

  return (
    <div className="order-flow-page">
    <div className="order-flow">
      <h2 className="order-flow__title">支付</h2>
      <div className="order-card order-card--center">
        <p className="pay-amount">¥{orderData.total}</p>
        <p className="order-card__muted">
          请在 <strong>{countdown}</strong> 秒内完成支付
        </p>
      </div>

      {paying && (
        <div className="pay-qr">
          <div className="pay-qr__box">
            <div className="pay-qr__pattern" />
            <span>模拟二维码</span>
          </div>
          <p>正在模拟 {payMethod === 'alipay' ? '支付宝' : '微信'} 支付…</p>
          <p className="order-card__muted">不跳转真实支付页面</p>
        </div>
      )}

      {!paying && (
        <div className="order-card">
          {PAY_METHODS.map((m) => (
            <label key={m.id} className="pay-method">
              <input
                type="radio"
                name="pay"
                value={m.id}
                checked={payMethod === m.id}
                onChange={() => setPayMethod(m.id)}
              />
              {m.name}
            </label>
          ))}
        </div>
      )}

      <button
        type="button"
        className="pay-confirm-btn"
        onClick={confirmPay}
        disabled={paying || countdown <= 0}
      >
        {paying ? '支付处理中…' : '确认支付'}
      </button>
      <p className="pay-hint">点击确认后展示模拟二维码，约 2 秒后自动完成支付</p>
    </div>
    </div>
  );
};

export default PayPage;
