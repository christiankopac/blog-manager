import type { User } from "../types"
import { fetchData } from "./api"

// This module:
// - Imports User type and generic fetchData function
// - Exports single async function to fetch users
// - Uses TypeScript generics for type safety
// - Returns promise of User array
// - Delegates actual API call to fetchData utility

/**
 * Fetches users from the API
 * Uses generic fetchData function with User type
 * 
 * @returns Promise resolving to array of User objects
 */
export const fetchUsers = async (): Promise<User[]> => {
  return fetchData<User[]>('/users')
}

