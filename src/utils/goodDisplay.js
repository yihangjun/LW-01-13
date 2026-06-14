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

/** 本地商品图片映射（与 public/images 对应） */
const LOCAL_GOOD_IMAGES = {
  1: '/images/xiaomi12pro.png',
  2: '/images/huawei-mate70.png',
  3: '/images/iphone16.png',
  4: '/images/lenovo-laptop.png',
  5: '/images/dyson-supersonic.png',
  6: '/images/nike-shoes.png',
  7: '/images/sony-wh1000xm5.png',
  8: '/images/ipad-air-m3.png',
  9: '/images/haier-fridge.png',
  10: '/images/midea-ac.png',
  11: '/images/dell-inspiron.png',
  12: '/images/mx-keys.png',
  13: '/images/lining-chitu.png',
  14: '/images/uniqlo-tshirt.png',
  15: '/images/cheers-sofa.png',
  16: '/images/opple-light.png',
  17: '/images/philips-s5588.png',
  18: '/images/castrol-oil.png',
  19: '/images/70mai-dashcam.png',
  20: '/images/deli-printer.png',
};

function isUsableImageUrl(url) {
  return url && !url.includes('picsum.photos');
}

export function isGoodOnSale(good) {
  if (!good) return false;
  if (good.isOnSale === false || good.onSale === false) return false;
  return true;
}

export function getGoodImage(good) {
  if (!good) return '';
  if (isUsableImageUrl(good.imgUrl)) return good.imgUrl;
  if (isUsableImageUrl(good.img)) return good.img;
  if (LOCAL_GOOD_IMAGES[good.id]) return LOCAL_GOOD_IMAGES[good.id];
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
