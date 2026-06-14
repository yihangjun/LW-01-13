import GoodImage from './GoodImage';

const ProductThumb = ({ product, className = 'product-thumb' }) => {
  if (!product) return null;

  return (
    <GoodImage
      good={product}
      className={className}
      alt={product.name || '商品'}
    />
  );
};

export default ProductThumb;
