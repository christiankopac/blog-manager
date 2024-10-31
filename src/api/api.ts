import { APICache } from './cache'

const cache = new APICache()
const BASE_URL = import.meta.env.VITE_API_URL

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export async function fetchData<T>(endpoint: string): Promise<T> {
  const cachedData = cache.get<T>(endpoint)
  if (cachedData) return cachedData

  const response = await fetch(`${BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  cache.set(endpoint, data)
  return data
}

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