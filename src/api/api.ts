import { APICache } from './cache'

// Initialize cache and base URL
const cache = new APICache()
const BASE_URL = import.meta.env.VITE_API_URL

// Define allowed HTTP methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/**
 * Generic function to fetch data with caching
 * @param endpoint API endpoint path
 * @returns Promise of generic type T
 */
export async function fetchData<T>(endpoint: string): Promise<T> {
  // Check cache first
  const cachedData = cache.get<T>(endpoint)
  if (cachedData) return cachedData

  // Fetch from API if not cached
  const response = await fetch(`${BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  // Cache and return data
  const data = await response.json()
  cache.set(endpoint, data)
  return data
}

/**
 * Generic function to send API requests
 * @param endpoint API endpoint path
 * @param method HTTP method to use
 * @param data Optional request body
 * @returns Promise of generic type T
 */
export async function sendRequest<T>(
  endpoint: string, 
  method: HttpMethod, 
  data?: unknown
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return method === 'DELETE' ? (undefined as T) : response.json()
}