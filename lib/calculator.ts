export const SQFT_PER_SQM = 10.7639
export const DEFAULT_PRICE = '70000'
export const DEFAULT_AREA = '216'
export const PRICE_STEP = 500

export type CalculatorResult = {
  areaSqft: number
  pricePerSqft: number
  total: number
  upfront: number
  incomeTaxTds: number
  stampDuty: number
  registrationFee: number
  urbanCess: number
  urbanSurcharge: number
  khataTransfer: number
  hiddenCosts: number
  registrationCharges: number
  additionalCharges: number
  allInTotal: number
}

export function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)
}

export function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(value || 0)
}

export function calculateBid(priceInput: string, areaInput: string): CalculatorResult {
  const pricePerSqm = Math.max(0, Number(priceInput) || 0)
  const areaSqm = Math.max(0, Number(areaInput) || 0)
  const areaSqft = areaSqm * SQFT_PER_SQM
  const pricePerSqft = pricePerSqm / SQFT_PER_SQM
  const total = pricePerSqm * areaSqm
  const incomeTaxTds = total * 0.01
  const stampDuty = total * 0.05
  const registrationFee = total * 0.02
  const urbanCess = stampDuty * 0.1
  const urbanSurcharge = stampDuty * 0.02
  const khataTransfer = stampDuty * 0.02
  const hiddenCosts = 80000
  const registrationCharges = incomeTaxTds + stampDuty + registrationFee + urbanCess + urbanSurcharge + khataTransfer
  const additionalCharges = registrationCharges + hiddenCosts

  return { areaSqft, pricePerSqft, total, upfront: total * 0.25, incomeTaxTds, stampDuty, registrationFee, urbanCess, urbanSurcharge, khataTransfer, hiddenCosts, registrationCharges, additionalCharges, allInTotal: total + additionalCharges }
}

export function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9.]/g, '')
}
