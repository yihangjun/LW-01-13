import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ServiceContext } from '../contexts/ServiceContext';
import { useUser } from '../contexts/UserContext';
import { ORDER_STATUS_TEXT } from '../constants/orderStatus';
import { useRequireUser } from '../hooks/useRequireUser';
import './OrderFlow.css';

const OrderListPage = () => {
  const { order } = useContext(ServiceContext);
  const { user } = useUser();
  const loggedIn = useRequireUser();

  const list = useMemo(
    () => (loggedIn ? order.getOrdersByUser(user.username) : []),
    [order, user, loggedIn],
  );

  if (!loggedIn) return null;

  return (
    <div className="order-flow-page">
      <div className="order-flow">
        <h2 className="order-flow__title">我的订单</h2>
        {list.length === 0 ? (
          <p className="order-card__muted">暂无订单</p>
        ) : (
          list.map((o) => (
            <Link key={o.id} to={`/order-detail/${o.id}`} className="order-card order-card--link">
              <div className="order-item-row">
                <span>订单号 {o.orderNo}</span>
                <span>{ORDER_STATUS_TEXT[o.status]}</span>
              </div>
              <p className="order-card__muted">{o.createTime}</p>
              <p>合计 ¥{o.total}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
