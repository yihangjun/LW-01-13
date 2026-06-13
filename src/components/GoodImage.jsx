import { getGoodImage } from '../utils/goodDisplay';

export default function GoodImage({ good, className, alt }) {
  const src = getGoodImage(good);
  
  // 如果有真实图片 URL，使用 img 标签并添加 onError 兜底
  if (src && !src.startsWith('data:image')) {
    return (
      <img
        src={src}
        alt={alt || good?.name || '商品'}
        className={className}
        loading="lazy"
        onError={(e) => {
          // 图片加载失败时，回退到颜色占位图
          e.target.onerror = null; // 防止无限循环
          const fallbackSrc = getGoodImage({ ...good, imgUrl: null, img: null });
          if (fallbackSrc) {
            e.target.src = fallbackSrc;
          }
        }}
      />
    );
  }
  
  // 如果是 SVG 占位图或没有图片，使用 div 背景
  if (src) {
    return (
      <img
        src={src}
        alt={alt || good?.name || '商品'}
        className={className}
        loading="lazy"
      />
    );
  }
  
  // 完全没有图片时，显示纯色背景
  return (
    <div
      className={className}
      style={{ background: good?.color || '#e8e5e0' }}
      aria-label={good?.name || '商品'}
    />
  );
}
