const ProductThumb = ({ product, className = 'product-thumb' }) => {
  if (!product) return null;
  const label = product.brand?.slice(0, 2) || product.name?.[0] || '?';

  return (
    <div
      className={className}
      style={{ background: product.color || '#e8e8e8' }}
      aria-hidden="true"
    >
      <span>{label}</span>
    </div>
  );
};

export default ProductThumb;
