import { getGoodImage } from '../utils/goodDisplay';

export default function GoodImage({ good, className, alt }) {
  const src = getGoodImage(good);
  if (src) {
    return (
      <img
        src={src}
        alt={alt || good?.name || '商品'}
        className={className}
        loading="lazy"
        onError={(e) => {
          e.target.src = '/images/default.png';
        }}
      />
    );
  }
  return (
    <div
      className={className}
      style={{ background: good?.color || '#e8e5e0' }}
      aria-label={good?.name || '商品'}
    />
  );
}
