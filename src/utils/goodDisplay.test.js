import { describe, expect, it } from 'vitest';
import { formatOrderAddress, getGoodImage, isGoodOnSale } from './goodDisplay';

describe('goodDisplay utilities', () => {
  it('uses local product image when API image is missing', () => {
    expect(getGoodImage({ id: 1, name: '小米 12 Pro' })).toBe('/images/xiaomi12pro.png');
  });

  it('ignores remote picsum placeholders and falls back to local image', () => {
    expect(getGoodImage({ id: 6, imgUrl: 'https://picsum.photos/seed/nike/400/400' })).toBe(
      '/images/nike-shoes.png',
    );
  });

  it('keeps explicit non-picsum image URLs', () => {
    expect(getGoodImage({ id: 99, imgUrl: '/uploads/custom.png' })).toBe('/uploads/custom.png');
  });

  it('formats address objects for order display', () => {
    expect(formatOrderAddress({ name: '张三', phone: '13800000000', detail: '上海市浦东新区' })).toBe(
      '张三 13800000000 上海市浦东新区',
    );
  });

  it('uses local iPhone 16 image for product id 3', () => {
    expect(getGoodImage({ id: 3, name: '苹果 iPhone 16' })).toBe('/images/iphone16.png');
  });

  it('returns placeholder text for missing address', () => {
    expect(formatOrderAddress(null)).toBe('未填写');
    expect(formatOrderAddress('')).toBe('未填写');
  });

  it('checks product sale status using both supported fields', () => {
    expect(isGoodOnSale({ onSale: true })).toBe(true);
    expect(isGoodOnSale({ onSale: false })).toBe(false);
    expect(isGoodOnSale({ isOnSale: false })).toBe(false);
  });
});
