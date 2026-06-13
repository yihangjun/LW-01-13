function colorPlaceholder(id, width, height) {
  const hue = ((id || 1) * 137) % 360;
  const bg = `hsl(${hue}, 55%, 75%)`;
  const fg = `hsl(${hue}, 45%, 40%)`;
  const w = width || 400;
  const h = height || 400;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <circle cx="${w / 2}" cy="${h * 0.4}" r="${Math.min(w, h) * 0.15}" fill="${fg}" opacity="0.3"/>
  <rect x="${w * 0.2}" y="${h * 0.58}" width="${w * 0.6}" height="${h * 0.08}" rx="4" fill="${fg}" opacity="0.25"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function isGoodOnSale(good) {
  if (!good) return false;
  if (good.isOnSale === false || good.onSale === false) return false;
  return true;
}

export function getGoodImage(good) {
  if (!good) return '';
  // 优先使用 imgUrl 字段（统一规范）
  if (good.imgUrl) return good.imgUrl;
  // 兼容旧的 img 字段
  if (good.img && !good.img.includes('picsum.photos')) return good.img;
  // 如果没有真实图片，使用颜色占位图
  if (good.color) return colorPlaceholder(good.id);
  if (good.id) return colorPlaceholder(good.id);
  return null;
}

export function formatOrderAddress(address) {
  if (!address) return '未填写';
  if (typeof address === 'string') return address;
  const parts = [address.name, address.phone, address.detail].filter(Boolean);
  return parts.join(' ') || '未填写';
}
