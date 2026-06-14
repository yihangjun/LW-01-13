import { describe, expect, it } from 'vitest';
import {
  calcDiscountPercent,
  calcOriginalFromDiscount,
  calcPriceFromDiscount,
  syncPriceFields,
} from './priceDiscount';

describe('priceDiscount utilities', () => {
  it('calculates discount percent from price and original', () => {
    expect(calcDiscountPercent(2299, 2999)).toBe(23);
    expect(calcDiscountPercent(399, 499)).toBe(20);
    expect(calcDiscountPercent(500, 500)).toBe(0);
  });

  it('derives price from original and discount', () => {
    expect(calcPriceFromDiscount(500, 20)).toBe(400);
    expect(calcPriceFromDiscount(499, 20)).toBe(399);
  });

  it('derives original from price and discount', () => {
    expect(calcOriginalFromDiscount(400, 20)).toBe(500);
    expect(calcOriginalFromDiscount(399, 20)).toBe(499);
  });

  it('syncs the third field when two are known', () => {
    const fromPrice = syncPriceFields('price', {
      price: '400',
      originalPrice: '500',
      discount: '',
    });
    expect(fromPrice.discount).toBe('20');

    const fromDiscount = syncPriceFields('discount', {
      price: '',
      originalPrice: '500',
      discount: '20',
    });
    expect(fromDiscount.price).toBe('400');
  });
});
