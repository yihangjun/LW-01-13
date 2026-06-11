import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, CheckCircle, QrCode, Shield, AlertCircle, XCircle } from "lucide-react";
import { ServiceContext } from "../contexts/ServiceContext";
import { ORDER_STATUS } from "../constants/orderStatus";
import { useToast } from "../components/Toast";
import { formatPrice } from "../utils/format";
import "./PayPage.css";

export default function PayPage() {
  const { orderId } = useParams();
  const parsedId = parseInt(orderId, 10);
  const services = useContext(ServiceContext);
  const toast = useToast();
  const navigate = useNavigate();

  const order = services.order.getOrderById(parsedId);
  const [countdown, setCountdown] = useState(900);
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!order) {
      navigate("/");
      return;
    }
    if (order.status === ORDER_STATUS.CLOSED || order.status === -1) {
      setCancelled(true);
      return;
    }
    if (order.status !== ORDER_STATUS.UNPAID) {
      navigate(`/order-detail/${orderId}`);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [order, orderId, navigate]);

  useEffect(() => {
    if (countdown === 0 && order && order.status === ORDER_STATUS.UNPAID) {
      services.order.cancelOrder(parsedId).catch(() => {});
      setCancelled(true);
      toast("订单已超时取消", "warning");
    }
  }, [countdown, order, parsedId, services.order, toast]);

  if (!order) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(async () => {
      try {
        await services.order.payOrder(parsedId);
        setPaid(true);
        toast("支付成功！", "success");
        setTimeout(() => navigate(`/order-detail/${order.id}`), 1500);
      } catch (err) {
        toast(err.message || "支付失败，请重试", "error");
      } finally {
        setPaying(false);
      }
    }, 2000);
  };

  if (paid) {
    return (
      <div className="pay-success container">
        <CheckCircle size={64} color="var(--color-success)" />
        <h1>支付成功</h1>
        <p>正在跳转到订单详情...</p>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="pay-success container">
        <XCircle size={64} color="var(--color-danger)" />
        <h1>订单已取消</h1>
        <p>支付超时，订单已自动取消</p>
        <button
          onClick={() => navigate("/order-list")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.5rem",
            background: "var(--color-info)",
            color: "white",
            borderRadius: "6px",
            fontWeight: 600,
          }}
        >
          返回订单列表
        </button>
      </div>
    );
  }

  return (
    <div className="pay-page container">
      <h1 className="pay-title">收银台</h1>
      <div className="pay-layout">
        <div className="pay-info">
          <div className="pay-order-summary">
            <AlertCircle size={16} />
            <span>订单号：{order.orderNo}</span>
          </div>
          <div className="pay-amount">
            <span className="pay-amount-label">应付金额</span>
            <span className="pay-amount-value">{formatPrice(order.total)}</span>
          </div>
          <div className={`pay-countdown ${countdown < 60 ? "urgent" : ""}`}>
            <Clock size={16} />
            <span>剩余支付时间：{formatTime(countdown)}</span>
          </div>
        </div>

        <div className="pay-qr-section">
          <h3>扫码支付</h3>
          <div className="pay-qr-box">
            <QrCode size={120} />
            <div className="pay-qr-overlay">
              <Shield size={20} />
              <span>安全支付</span>
            </div>
          </div>
          <p className="pay-qr-hint">请使用手机扫码完成支付</p>
          <button
            className="pay-btn"
            onClick={handlePay}
            disabled={paying || countdown === 0}
          >
            {paying ? "处理中..." : `确认支付 ${formatPrice(order.total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
