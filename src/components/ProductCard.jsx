import { memo } from 'react';
import { Link } from 'react-router-dom';
import ProductThumb from './ProductThumb';

const ProductCard = memo(function ProductCard({ product }) {
  if (!product?.id) return null;

  return (
    <Link to={`/detail/${product.id}`} className="product-card">
      <div className="product-card__img-wrap">
        <ProductThumb product={product} className="product-card__thumb" />
        {product.isNew && <span className="product-card__badge">新品</span>}
      </div>
      <div className="product-card__info">
        <p className="product-card__name">{product.name}</p>
        <p className="product-card__price">¥{product.price}</p>
      </div>
    </Link>
  );
});

export default ProductCard;
