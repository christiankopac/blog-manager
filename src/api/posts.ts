import type { Post, CreatePostData, UpdatePostData } from "../types/post"
import { fetchData, sendRequest } from "./api"

// This module:
// - Provides CRUD operations for posts
// - Uses TypeScript for type safety
// - Leverages common API utilities (fetchData/sendRequest)
// - Returns promises for async operations
// - Follows RESTful conventions

// Each function:
// - Has clear single responsibility
// - Is properly typed
// - Handles one HTTP method
// - Uses template literals for URLs

/**
 * API functions for managing posts
 */

// Fetch all posts
export const fetchPosts = async (): Promise<Post[]> => {
  return fetchData<Post[]>('/posts')
}

// Create a new post
export const createPost = async (postData: CreatePostData): Promise<Post> => {
  return sendRequest<Post>('/posts', 'POST', postData)
}

// Update an existing post
export const updatePost = async (id: number, postData: UpdatePostData): Promise<Post> => {
  return sendRequest<Post>(`/posts/${id}`, 'PUT', postData)
}

// Delete a post
export const deletePost = async (id: number): Promise<void> => {
  return sendRequest<void>(`/posts/${id}`, 'DELETE')
}

