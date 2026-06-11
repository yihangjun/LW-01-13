import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { ServiceContext } from "../contexts/ServiceContext";
import { useCart } from "../contexts/CartContext";
import { useMallAuth } from "../hooks/useMallAuth";
import { useToast } from "../components/Toast";
import GoodImage from "../components/GoodImage";
import { defaultAddress } from "../mock/addresses";
import { formatPrice } from "../utils/format";
import "./CreateOrderPage.css";

export default function CreateOrderPage() {
  const { goodId } = useParams();
  const services = useContext(ServiceContext);
  const { clearSelected } = useCart();
  const { user, updateUser } = useMallAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const initialAddress = typeof user?.address === "string"
    ? user.address
    : user?.address?.detail || "";

  const [address, setAddress] = useState(initialAddress);
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let items;
    if (goodId) {
      const good = services.good.getGoodById(parseInt(goodId, 10));
      if (!good) { navigate("/"); return; }
      items = [{ goodId: good.id, count: 1, price: good.price }];
    } else {
      const stored = localStorage.getItem("checkoutItems");
      if (!stored) { navigate("/cart"); return; }
      const parsed = JSON.parse(stored);
      items = parsed.map((i) => {
        const g = services.good.getGoodById(i.goodId);
        return { goodId: i.goodId, count: i.count, price: g?.price || 0 };
      });
    }
    setOrderItems(items);
    setTotal(items.reduce((s, i) => s + i.price * i.count, 0));
  }, [goodId, services, navigate]);

  const handleSubmit = async () => {
    if (!address.trim()) { toast("请填写收货地址", "warning"); return; }

    for (const item of orderItems) {
      const good = services.good.getGoodById(item.goodId);
      if (good && good.stock != null && item.count > good.stock) {
        toast(`「${good.name}」库存不足，仅剩 ${good.stock} 件`, "warning");
        return;
      }
    }

    try {
      await updateUser({ address: address.trim() });
      const order = await services.order.createOrder({
        userAccount: user.username,
        items: orderItems,
        total,
        address: { ...defaultAddress, detail: address.trim() },
      });
      if (!goodId) {
        clearSelected();
        localStorage.removeItem("checkoutItems");
      }
      navigate(`/pay/${order.id}`);
    } catch (err) {
      toast(err.message || "创建订单失败", "error");
    }
  };

  return (
    <div className="create-order-page container">
      <h1 className="co-title">确认订单</h1>
      <div className="co-address">
        <div className="co-address-header">
          <MapPin size={18} />
          <h3>收货地址</h3>
        </div>
        <input
          className="co-address-input"
          type="text"
          placeholder="请输入收货地址"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="co-items">
        <h3>商品清单</h3>
        {orderItems.map((item, idx) => {
          const good = services.good.getGoodById(item.goodId);
          return (
            <div key={idx} className="co-item">
              <div className="co-item-img">
                <GoodImage good={good} />
              </div>
              <div className="co-item-info">
                <span className="co-item-name">{good?.name}</span>
                <span className="co-item-meta">×{item.count}</span>
              </div>
              <span className="co-item-price">{formatPrice(item.price * item.count)}</span>
            </div>
          );
        })}
      </div>
      <div className="co-footer">
        <div className="co-total">
          <span>合计</span>
          <span className="co-total-price">{formatPrice(total)}</span>
        </div>
        <button className="co-submit" onClick={handleSubmit}>
          提交订单 <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
