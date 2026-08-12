import { describe, expect, it } from 'vitest'
import { formatPrice } from './menu'

describe('formatPrice', () => {
  it('formats integer cents as Brazilian real', () => {
    expect(formatPrice(1250)).toBe('R$ 12,50')
  })
})
