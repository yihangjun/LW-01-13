export function formatPrice(n) {
  if (n == null || isNaN(n)) return "¥0";
  const parts = String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `¥${parts}`;
}
