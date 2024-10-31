interface CacheEntry<T> {
  data: T
  timestamp: number
}

export class APICache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private readonly TTL: number // Time to live in milliseconds

  constructor(ttlMinutes = 5) {
    this.TTL = ttlMinutes * 60 * 1000
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > this.TTL
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  clear(): void {
    this.cache.clear()
  }
}