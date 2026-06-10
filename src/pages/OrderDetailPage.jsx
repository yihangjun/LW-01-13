import { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ServiceContext } from '../contexts/ServiceContext';
import { ORDER_STATUS_TEXT } from '../constants/orderStatus';
import ProductThumb from '../components/ProductThumb';
import './OrderFlow.css';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { order } = useContext(ServiceContext);
  const orderData = order.getOrderById(orderId);

  if (!orderData) {
    return (
      <div className="order-flow-page">
        <div className="order-flow order-flow--center">
          <p>订单不存在</p>
          <Link to="/order-list" className="pay-success-link">返回订单列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-flow-page">
      <div className="order-flow">
        <div className="order-status-banner">{ORDER_STATUS_TEXT[orderData.status]}</div>
        <div className="order-card">
          <h3>收货信息</h3>
          <p>{orderData.address?.name} {orderData.address?.phone}</p>
          <p className="order-card__muted">{orderData.address?.detail}</p>
        </div>
        <div className="order-card">
          <h3>商品信息</h3>
          {orderData.items?.map((item) => (
            <div key={item.goodId} className="order-item-row order-item-row--with-img">
              <ProductThumb product={item} className="order-item__thumb" />
              <div className="order-item__info">
                <strong>{item.name}</strong>
                <small>x{item.count}</small>
              </div>
              <span className="order-item__price">¥{item.price * item.count}</span>
            </div>
          ))}
        </div>
        <div className="order-card">
          <div className="order-item-row"><span>订单编号</span><span>{orderData.orderNo}</span></div>
          <div className="order-item-row"><span>创建时间</span><span>{orderData.createTime}</span></div>
          <div className="order-item-row"><span>支付方式</span><span>{orderData.payMethod || '未支付'}</span></div>
          <div className="order-item-row order-item-row--total"><span>实付</span><span>¥{orderData.total}</span></div>
        </div>
        {orderData.status === 2 && (
          <p className="order-card__muted">物流信息：包裹已发出，预计 3 日内送达</p>
        )}
        <Link to="/order-list" className="pay-success-link">返回订单列表</Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;
