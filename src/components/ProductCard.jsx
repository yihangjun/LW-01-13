import { useContext, memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useMallAuth } from "../hooks/useMallAuth";
import GoodImage from "./GoodImage";
import { ServiceContext } from "../contexts/ServiceContext";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/format";
import { calcDiscountPercent } from "../utils/priceDiscount";
import "./ProductCard.css";

const ProductCard = memo(function ProductCard({ good }) {
  const { addToCart } = useCart();
  const { user } = useMallAuth();
  const services = useContext(ServiceContext);
  const navigate = useNavigate();

  const category = services.category?.getDisplayInfo(good.categoryId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    addToCart(good.id, 1, good);
  };

  const discount = calcDiscountPercent(good.price, good.originalPrice);

  return (
    <Link to={`/detail/${good.id}`} className="product-card">
      <div className="product-card-img">
        <GoodImage good={good} />
        {discount > 0 && <span className="product-card-badge">-{discount}%</span>}
        {category && <span className="product-card-cat">{category.icon} {category.label}</span>}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{good.name}</h3>
        <div className="product-card-price">
          <span className="price-current">{formatPrice(good.price)}</span>
          {good.originalPrice && (
            <span className="price-original">{formatPrice(good.originalPrice)}</span>
          )}
        </div>
        <div className="product-card-meta">
          <span className="meta-sales">
            <Zap size={12} /> 已售 {good.sales || 0}
          </span>
        </div>
      </div>
      <button className="product-card-cart" onClick={handleAddToCart} title="加入购物车">
        <ShoppingCart size={16} />
      </button>
    </Link>
  );
});

export default ProductCard;
