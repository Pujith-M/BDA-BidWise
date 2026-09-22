export const SAVED_CONFIGS_KEY = 'bidwise-saved-configurations'

export type SavedConfiguration = { id: string; name: string; price: string; area: string }

export function readSavedConfigurations(): SavedConfiguration[] {
  try {
    const stored = window.localStorage.getItem(SAVED_CONFIGS_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as SavedConfiguration[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    window.localStorage.removeItem(SAVED_CONFIGS_KEY)
    return []
  }
}

export function writeSavedConfigurations(configurations: SavedConfiguration[]) {
  window.localStorage.setItem(SAVED_CONFIGS_KEY, JSON.stringify(configurations))
}
