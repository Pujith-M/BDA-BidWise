import { describe, expect, it } from 'vitest'
import {
  DEFAULT_AREA,
  DEFAULT_PRICE,
  PRICE_STEP,
  SQFT_PER_SQM,
  calculateBid,
  formatINR,
  sanitizeNumericInput,
} from './calculator'

describe('calculator constants', () => {
  it('uses the standard defaults and price increment', () => {
    expect(DEFAULT_PRICE).toBe('70000')
    expect(DEFAULT_AREA).toBe('216')
    expect(PRICE_STEP).toBe(500)
  })
})

describe('calculateBid', () => {
  it('converts area and price accurately', () => {
    const result = calculateBid('70000', '216')

    expect(result.areaSqft).toBeCloseTo(216 * SQFT_PER_SQM, 8)
    expect(result.pricePerSqft).toBeCloseTo(70000 / SQFT_PER_SQM, 8)
    expect(result.total).toBe(15120000)
    expect(result.upfront).toBe(3780000)
  })

  it('calculates registration and all-in charges from the bid total', () => {
    const result = calculateBid('100000', '10')
    const registration = 1000000 * (0.01 + 0.05 + 0.02 + 0.05 * 0.1 + 0.05 * 0.02 + 0.05 * 0.02)

    expect(result.incomeTaxTds).toBe(10000)
    expect(result.stampDuty).toBe(50000)
    expect(result.registrationFee).toBe(20000)
    expect(result.registrationCharges).toBeCloseTo(registration, 8)
    expect(result.additionalCharges).toBeCloseTo(registration + 80000, 8)
    expect(result.allInTotal).toBeCloseTo(1000000 + registration + 80000, 8)
  })

  it('treats invalid and negative inputs as zero', () => {
    const result = calculateBid('-100', 'not-a-number')

    expect(result.total).toBe(0)
    expect(result.areaSqft).toBe(0)
    expect(result.pricePerSqft).toBe(0)
    expect(result.allInTotal).toBe(80000)
  })
})

describe('formatting helpers', () => {
  it('formats Indian currency and numbers', () => {
    expect(formatINR(15120000)).toBe('₹1,51,20,000')
    expect(formatINR(0)).toContain('0')
  })

  it('removes non-numeric characters from input', () => {
    expect(sanitizeNumericInput('₹70,000abc')).toBe('70000')
    expect(sanitizeNumericInput('216.5 m²')).toBe('216.5')
  })
})

