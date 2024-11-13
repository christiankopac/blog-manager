import type { PostsStore } from "@/stores/posts"

// This composable:
// - Defines interface for post creation data
// - Takes a posts store instance as parameter
// - Provides a method to save/update posts through the store
// - Returns the save method for use in components

/**
 * Interface defining the structure of post creation data
 */
interface CreatePostData {
  title: string   // Post title
  body: string    // Post content
  userId: number  // Author ID
}

/**
 * Custom composable for post actions
 * Provides functionality to save posts through the store
 * 
 * @param store - Instance of the posts store
 * @returns Object containing post action methods
 */
export function usePostAction(store: PostsStore) {
  /**
   * Saves a post (creates new or updates existing)
   * @param postData - Post data with optional ID for updates
   * @returns Promise from store save operation
   */
  const savePost = async (postData: CreatePostData & { id?: number }) => {
    return store.savePost(postData)
  }

  return {
    savePost // Method to save/update posts
  }
}
