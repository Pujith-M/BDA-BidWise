import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  SAVED_CONFIGS_KEY,
  readSavedConfigurations,
  writeSavedConfigurations,
} from './saved-configurations'

function createLocalStorage() {
  const values = new Map<string, string>()

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  }
}

describe('saved configurations', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { localStorage: createLocalStorage() },
    })
  })

  it('returns an empty list when no configurations are stored', () => {
    expect(readSavedConfigurations()).toEqual([])
  })

  it('writes and reads configurations using the shared storage key', () => {
    const configurations = [
      { id: '1', name: 'North plot', price: '70000', area: '216' },
    ]

    writeSavedConfigurations(configurations)

    expect(window.localStorage.getItem(SAVED_CONFIGS_KEY)).toBe(JSON.stringify(configurations))
    expect(readSavedConfigurations()).toEqual(configurations)
  })

  it('returns an empty list and clears malformed stored data', () => {
    window.localStorage.setItem(SAVED_CONFIGS_KEY, '{invalid json')

    expect(readSavedConfigurations()).toEqual([])
    expect(window.localStorage.getItem(SAVED_CONFIGS_KEY)).toBeNull()
  })

  it('returns an empty list when stored JSON is not an array', () => {
    window.localStorage.setItem(SAVED_CONFIGS_KEY, JSON.stringify({ name: 'not a list' }))

    expect(readSavedConfigurations()).toEqual([])
  })
})


afterEach(() => {
  delete (globalThis as { window?: unknown }).window
})
