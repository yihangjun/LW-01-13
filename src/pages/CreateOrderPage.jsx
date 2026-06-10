import { useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ServiceContext } from '../contexts/ServiceContext';
import { useUser } from '../contexts/UserContext';
import { defaultAddress } from '../mock/addresses';
import { useRequireUser } from '../hooks/useRequireUser';
import ProductThumb from '../components/ProductThumb';
import './OrderFlow.css';

const CreateOrderPage = () => {
  const { goodId } = useParams();
  const { good, order, cart } = useContext(ServiceContext);
  const { user } = useUser();
  const navigate = useNavigate();
  const loggedIn = useRequireUser();

  const isCart = goodId === 'cart';

  const orderItems = useMemo(() => {
    if (isCart) {
      return cart.getSelectedItems().map((item) => {
        const g = good.getGoodById(item.goodId);
        return {
          goodId: item.goodId,
          count: item.count,
          price: g?.price ?? 0,
          name: g?.name ?? '',
          spec: g?.spec ?? '',
          color: g?.color ?? '#ccc',
          brand: g?.brand ?? '',
        };
      });
    }
    const g = good.getGoodById(goodId);
    if (!g) return [];
    return [{
      goodId: g.id,
      count: 1,
      price: g.price,
      name: g.name,
      spec: g.spec,
      color: g.color,
      brand: g.brand,
    }];
  }, [isCart, goodId, cart, good]);

  const total = orderItems.reduce((sum, i) => sum + i.price * i.count, 0);

  if (!loggedIn) return null;

  if (orderItems.length === 0) {
    return (
      <div className="order-flow-page">
        <div className="order-flow order-flow--center">
          <p>没有可结算的商品</p>
          <button type="button" className="order-submit-bar__btn" onClick={() => navigate('/')}>返回首页</button>
        </div>
      </div>
    );
  }

  const submit = () => {
    const created = order.createOrder({
      userAccount: user.username,
      items: orderItems,
      address: { ...defaultAddress },
      total,
    });
    if (isCart) {
      cart.getSelectedItems().forEach((i) => cart.removeItem(i.goodId));
    }
    navigate(`/pay/${created.id}`);
  };

  return (
    <div className="order-flow-page">
      <div className="order-flow">
        <h2 className="order-flow__title">确认订单</h2>
        <div className="order-card">
          <h3>收货信息</h3>
          <p>{defaultAddress.name} {defaultAddress.phone}</p>
          <p className="order-card__muted">{defaultAddress.detail}</p>
        </div>
        <div className="order-card">
          <h3>商品清单</h3>
          {orderItems.map((item) => (
            <div key={item.goodId} className="order-item-row order-item-row--with-img">
              <ProductThumb product={item} className="order-item__thumb" />
              <div className="order-item__info">
                <strong>{item.name}</strong>
                <small>{item.spec} · x{item.count}</small>
              </div>
              <span className="order-item__price">¥{item.price * item.count}</span>
            </div>
          ))}
        </div>
        <div className="order-card">
          <div className="order-item-row"><span>商品合计</span><span>¥{total}</span></div>
          <div className="order-item-row"><span>运费</span><span>¥0</span></div>
          <div className="order-item-row order-item-row--total"><span>应付</span><span>¥{total}</span></div>
        </div>
        <div className="order-submit-bar">
          <span>合计 <strong>¥{total}</strong></span>
          <button type="button" className="order-submit-bar__btn" onClick={submit}>提交订单</button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;
