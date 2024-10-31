import type { User } from "../types"
import { fetchData } from "./api"

export const fetchUsers = async (): Promise<User[]> => {
  return fetchData<User[]>('/users')
}