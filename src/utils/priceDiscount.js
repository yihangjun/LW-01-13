/** 根据现价与原价计算折扣百分比（四舍五入，如 23 表示 -23%） */
export function calcDiscountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= 0 || !price || price <= 0) return 0;
  if (price >= originalPrice) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}

/** 原价 × (1 - 折扣%) → 现价 */
export function calcPriceFromDiscount(originalPrice, discountPercent) {
  if (!originalPrice || originalPrice <= 0) return null;
  const d = Number(discountPercent);
  if (!Number.isFinite(d) || d <= 0 || d >= 100) return null;
  return Math.round(originalPrice * (1 - d / 100));
}

/** 现价 ÷ (1 - 折扣%) → 原价 */
export function calcOriginalFromDiscount(price, discountPercent) {
  if (!price || price <= 0) return null;
  const d = Number(discountPercent);
  if (!Number.isFinite(d) || d <= 0 || d >= 100) return null;
  return Math.round(price / (1 - d / 100));
}

export function parsePriceInput(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * 修改现价 / 原价 / 折扣之一后，根据已填写的另两项自动推算第三项
 */
export function syncPriceFields(changedField, fields) {
  const next = { ...fields };
  const price = parsePriceInput(next.price);
  const originalPrice = parsePriceInput(next.originalPrice);
  const discount = parsePriceInput(next.discount);

  if (changedField === 'price') {
    if (originalPrice != null && originalPrice > 0 && price != null) {
      next.discount = String(calcDiscountPercent(price, originalPrice));
    } else if (
      discount != null && discount > 0 && discount < 100 && price != null
    ) {
      const orig = calcOriginalFromDiscount(price, discount);
      if (orig != null) next.originalPrice = String(orig);
    }
  } else if (changedField === 'originalPrice') {
    if (price != null && originalPrice != null && originalPrice > 0) {
      next.discount = String(calcDiscountPercent(price, originalPrice));
    } else if (
      discount != null && discount > 0 && discount < 100 && originalPrice != null
    ) {
      const p = calcPriceFromDiscount(originalPrice, discount);
      if (p != null) next.price = String(p);
    }
  } else if (changedField === 'discount') {
    if (discount == null || discount <= 0) {
      next.discount = '';
    } else if (
      originalPrice != null && originalPrice > 0 && discount < 100
    ) {
      const p = calcPriceFromDiscount(originalPrice, discount);
      if (p != null) next.price = String(p);
    } else if (price != null && discount < 100) {
      const orig = calcOriginalFromDiscount(price, discount);
      if (orig != null) next.originalPrice = String(orig);
    }
  }

  return next;
}
