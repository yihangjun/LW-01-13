import { describe, expect, it } from 'vitest';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formats integers with yen symbol', () => {
    expect(formatPrice(2999)).toBe('¥2,999');
    expect(formatPrice(99)).toBe('¥99');
  });

  it('rounds fractional values', () => {
    expect(formatPrice(2999.6)).toBe('¥3,000');
  });

  it('handles null and invalid input', () => {
    expect(formatPrice(null)).toBe('¥0');
    expect(formatPrice(undefined)).toBe('¥0');
    expect(formatPrice('abc')).toBe('¥0');
  });
});
