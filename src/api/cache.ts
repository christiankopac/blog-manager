// Interface for cache entries with generic type and timestamp
interface CacheEntry<T> {
  data: T           // Cached data of generic type
  timestamp: number // Unix timestamp when entry was created
}

// Cache implementation with TTL support
export class APICache {
  private cache = new Map<string, CacheEntry<unknown>>() // Internal storage
  private readonly TTL: number // Time to live in milliseconds

  /**
   * Create cache instance with configurable TTL
   * @param ttlMinutes Time to live in minutes (default 5)
   */
  constructor(ttlMinutes = 5) {
    this.TTL = ttlMinutes * 60 * 1000 // Convert to milliseconds
  }

  /**
   * Store data in cache with current timestamp
   * @param key Cache key
   * @param data Data to cache
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Retrieve data from cache if not expired
   * @param key Cache key
   * @returns Cached data or null if missing/expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > this.TTL
    if (isExpired) {
      this.cache.delete(key) // Clean up expired entry
      return null
    }

    return entry.data as T
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear()
  }
}

// This cache:
// - Uses generics for type-safe data storage
// - Supports configurable TTL (time-to-live)
// - Auto-removes expired entries on access
// - Provides simple set/get/clear interface
// - Stores timestamps with each entry
// - Uses Map for efficient key-value storage