import type { User } from "../types"
import { fetchData } from "./api"

/**
 * Fetches users from the API
 * Uses generic fetchData function with User type
 * 
 * @returns Promise resolving to array of User objects
 */
export const fetchUsers = async (): Promise<User[]> => {
  return fetchData<User[]>('/users')
}

// This module:
// - Imports User type and generic fetchData function
// - Exports single async function to fetch users
// - Uses TypeScript generics for type safety
// - Returns promise of User array
// - Delegates actual API call to fetchData utility

// The function is:
// - Simple and focused
// - Type-safe with TypeScript
// - Reuses common fetch logic
// - Promise-based for async handling